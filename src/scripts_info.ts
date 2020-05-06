import { blue, bold, gray } from "../deps.ts";
import {
  ScriptsConfiguration,
  ScriptDefinition,
  isScriptObject,
} from "./scripts_config.ts";
import { flattenCommands, normalizeScript } from "./normalize_script.ts";

export function printScriptsInfo(config: ScriptsConfiguration) {
  const scripts = Object.entries(config.scripts);
  console.log(
    `Available scripts:\n\n${
      scripts.map(([name, value]) =>
        `• ${blue(bold(name))}\n${scriptInfo(value)}`
      ).join("\n\n")
    }\n\nTo run a script pass its name as the first argument to the ${
      bold("vr")
    } command (ie: ${
      bold(`vr ${scripts[0][0]}`)
    }).\nAny additional arguments will be passed to the script.`,
  );
}

function scriptInfo(script: ScriptDefinition): string {
  let info = [];
  if (script instanceof Object && isScriptObject(script) && script.desc) {
    info.push(`  ${script.desc}`);
  }
  const commands = flattenCommands(normalizeScript(script, {}));
  info.push(
    gray(
      `  $ ${commands.map((c) => c.cmd).slice(0, 3).join(", ")}${
        commands.length > 3 ? "..." : ""
      }`,
    ),
  );
  return info.join("\n");
}
