import { blue, bold, gray, red } from "../deps.ts";
import { ScriptDefinition, ScriptsConfiguration } from "./scripts_config.ts";
import { flattenCommands, normalizeScript } from "./normalize_script.ts";
import { isScriptObject } from "./util.ts";

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
  if (isScriptObject(script)) {
    if (script.desc) info.push(`    ${script.desc}`);
    if (script.githook) {
      info.push(`    ${gray("Runs at")} ${red(script.githook)}`);
    }
  }
  const commands = flattenCommands(normalizeScript(script, {}));
  info.push(
    gray(
      `    $ ${commands.map((c) => c.cmd).slice(0, 3).join(", ")}${
        commands.length > 3 ? "..." : ""
      }`,
    ),
  );
  return info.join("\n");
}
