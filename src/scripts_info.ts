import { blue, bold, gray, red } from "../deps.ts";
import {
  ScriptDefinition,
  ScriptObject,
  ScriptsConfiguration,
} from "./scripts_config.ts";
import { flattenCommands, normalizeScript } from "./normalize_script.ts";
import { isNonParallelCompositeScript, isScriptObject } from "./util.ts";

export function printScriptsInfo(config: ScriptsConfiguration) {
  const scripts = Object.entries(config.scripts);
  console.log(`
  🦖 ${bold("Available scripts")}
  
${
    scripts.map(([name, value]) =>
      `    • ${blue(bold(name))}\n${scriptInfo(value)}`
    ).join("\n\n")
  }
    
  To run a script pass its name as the first argument to the ${
    bold("vr")
  } command:
  
  $ ${bold(`vr ${scripts[0][0]}`)}
    
  Any additional arguments will be passed to the script.
`);
}

function scriptInfo(script: ScriptDefinition): string {
  const info = [];
  const indent = " ".repeat(4);
  if (isScriptObject(script)) {
    if (script.desc) info.push(`    ${script.desc}`);
    if (script.gitHook) {
      info.push(`${indent}${gray("Runs at")} ${red(script.gitHook)}`);
    }
  } else if (isNonParallelCompositeScript(script)) {
    const scripts = script.filter((s) => isScriptObject(s)) as Array<
      ScriptObject
    >;
    const combinedDescriptions = scripts.flatMap((s) => {
      if (typeof s === "string") return [];
      return s.desc;
    }).filter(Boolean);
    info.push(`${indent}${combinedDescriptions.join(", ")}`);
  }
  const commands = flattenCommands(normalizeScript(script, {}));
  info.push(
    gray(
      `${indent}$ ${commands.map((c) => c.cmd).slice(0, 3).join(", ")}${
        commands.length > 3 ? "..." : ""
      }`,
    ),
  );
  return info.join("\n");
}
