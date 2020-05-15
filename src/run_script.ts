import { ConfigData } from "./load_config.ts";
import { log } from "./logger.ts";
import { printScriptsInfo } from "./scripts_info.ts";
import { bold } from "../deps.ts";
import { didYouMean } from "./did_you_mean.ts";
import { normalizeScript } from "./normalize_script.ts";
import { resolveShell } from "./resolve_shell.ts";
import { runCommands } from "./run_commands.ts";

export async function runScript(
  configData: ConfigData | null,
  script: string,
  additionalArgs: string[] = [],
) {
  if (!configData) {
    throw new Error("No scripts file found.");
  }
  const { cwd, config } = configData;
  if (!config.scripts || Object.entries(config.scripts).length < 1) {
    log.warning(
      "No scripts available.\nSee https://deno.land/x/velociraptor for guidance on how to create scripts.",
    );
    Deno.exit();
  }
  if (script == null || script.length < 1) {
    printScriptsInfo(config);
    Deno.exit();
  }
  if (!(script in config.scripts)) {
    log.error(`Script ${bold(script)} not found`);
    const suggestion = didYouMean(script, config.scripts);
    if (suggestion) console.log(`Did you mean ${bold(suggestion)}?`);
    else {
      console.log(
        `Run ${
          bold("vr")
        } without arguments to see a list of available scripts.`,
      );
    }
    Deno.exit();
  }
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
