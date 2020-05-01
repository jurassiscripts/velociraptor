import * as log from "https://deno.land/std/log/mod.ts";
import { blue, bold, gray } from "https://deno.land/std/fmt/colors.ts";
import {
  ScriptsConfiguration,
  ScriptDefinition,
  isScriptObject,
} from "./types.ts";
import { flattenCommands, normalizeScript } from "./normalize_script.ts";

export function printScriptsInfo(config: ScriptsConfiguration) {
  const scripts = Object.entries(config.scripts);
  if (scripts.length < 1) {
    log.info(
      "No scripts available.\nSee https://github.com/umbopepato/velociraptor for guidance on how to create scripts.",
    );
  }
  console.log(
    `🦖 Available scripts:\n\n${
      scripts.map(([name, value]) =>
        `• ${blue(bold(name))}\n${scriptInfo(value)}`
      ).join("\n\n")
    }\n\nTo run a script pass its name as the first argument to the \`vr\` command (ie: vr ${
      scripts[0][0]
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
    gray(`  $ ${
      commands.map((c) => c.cmd).slice(0, 3).join(", ")
    }${
      commands.length > 3 ? "..." : ""
    }`),
  );
  return info.join("\n");
}
