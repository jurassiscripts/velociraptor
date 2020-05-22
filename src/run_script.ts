import { ConfigData } from "./load_config.ts";
import { log } from "./logger.ts";
import { printScriptsInfo } from "./scripts_info.ts";
import { bold } from "../deps.ts";
import { normalizeScript } from "./normalize_script.ts";
import { resolveShell } from "./resolve_shell.ts";
import { runCommands } from "./run_commands.ts";
import { checkConfigData } from "./check_config_data.ts";
import { checkScript } from "./check_script.ts";

export async function runScript(
  configData: ConfigData | null,
  script: string,
  additionalArgs: string[] = [],
) {
  checkConfigData(configData);
  const { cwd, config } = configData as ConfigData;
  if (script == null || script.length < 1) {
    printScriptsInfo(config);
    Deno.exit();
  }
  checkScript(script, config);
  const scriptDef = config.scripts[script];
  const { scripts, ...rootConfig } = config;
  const commands = normalizeScript(scriptDef, rootConfig);
  const shell = resolveShell();
  try {
    await runCommands(commands, shell, additionalArgs, cwd);
  } catch (e) {
    log.error(`Failed at the ${bold(script)} script`);
    Deno.exit(3);
  }
}
