import * as log from "https://deno.land/std/log/mod.ts";
import { loadConfig } from "./src/config_loader.ts";
import { normalizeScript } from "./src/normalize_script.ts";
import { runCommands } from "./src/runner.ts";
import { resolveShell } from "./src/resolve_shell.ts";
import { printScriptsInfo } from "./src/scripts_info.ts";

if (import.meta.main) {
  const config = loadConfig();
  const args = Deno.args;
  if (args.length < 1) {
    printScriptsInfo(config);
    Deno.exit();
  }
  const scriptName = args[0];
  if (!(scriptName in config.scripts)) {
    throw new Error(`Script ${scriptName} not found`); // TODO add did you mean?
  }
  const scriptDef = config.scripts[scriptName];
  const { scripts, ...rootConfig } = config;
  const commands = normalizeScript(scriptDef, rootConfig);
  const shell = resolveShell(config);
  try {
    await runCommands(commands, shell, args.slice(1));
  } catch (e) {
    log.error(`Failed at the \`${scriptName}\` script`);
  }
}
