import { bold } from "./deps.ts";
import { loadConfig } from "./src/load_config.ts";
import { normalizeScript } from "./src/normalize_script.ts";
import { runCommands } from "./src/run_commands.ts";
import { resolveShell } from "./src/resolve_shell.ts";
import { printScriptsInfo } from "./src/scripts_info.ts";
import { log } from "./src/logger.ts";
import { didYouMean } from "./src/did_you_mean.ts";
import { handleOption } from "./src/options.ts";
import { checkGitHooks } from "./src/git_hooks.ts";

if (import.meta.main) {
  let isOption = false, configData;
  const args = Deno.args;
  try {
    configData = loadConfig();
  } catch (e) {
    log.error(e.message);
    Deno.exit(2);
  }
  if (args.length > 0 && args[0].startsWith("-")) {
    isOption = true;
    try {
      await handleOption(args, configData);
    } catch (e) {
      log.error(e.message);
      Deno.exit(1);
    }
  }
  const { config, cwd } = configData;
  if (!config.scripts || Object.entries(config.scripts).length < 1) {
    log.warning(
      "No scripts available.\nSee https://deno.land/x/velociraptor for guidance on how to create scripts.",
    );
    Deno.exit();
  }
  try {
    checkGitHooks(config, cwd);
  } catch (e) {
    log.error(e);
  }
  if (args.length < 1) {
    printScriptsInfo(config);
    Deno.exit();
  }
  if (isOption) Deno.exit();
  const scriptName = args[0];
  if (!(scriptName in config.scripts)) {
    log.error(`Script ${bold(scriptName)} not found`);
    const suggestion = didYouMean(scriptName, config.scripts);
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
  const scriptDef = config.scripts[scriptName];
  const { scripts, ...rootConfig } = config;
  const commands = normalizeScript(scriptDef, rootConfig);
  const shell = resolveShell();
  try {
    await runCommands(commands, shell, args.slice(1), cwd);
  } catch (e) {
    log.error(`Failed at the ${bold(scriptName)} script`);
    Deno.exit(3);
  }
}
