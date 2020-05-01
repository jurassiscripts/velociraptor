import { bold } from "https://deno.land/std/fmt/colors.ts";
import { loadConfig } from "./src/config_loader.ts";
import { normalizeScript } from "./src/normalize_script.ts";
import { runCommands } from "./src/runner.ts";
import { resolveShell } from "./src/resolve_shell.ts";
import { printScriptsInfo } from "./src/scripts_info.ts";
import { log } from "./src/logger.ts";
import { didYouMean } from "./src/did_you_mean.ts";

if (import.meta.main) {
  let configData;
  try {
    configData = loadConfig();
  } catch (e) {
    log.error(e.message);
    Deno.exit();
  }
  const { config, cwd } = configData;
  if (!config.scripts || Object.entries(config.scripts).length < 1) {
    log.warning(
      "No scripts available.\nSee https://github.com/umbopepato/velociraptor for guidance on how to create scripts.",
    );
    Deno.exit();
  }
  const args = Deno.args;
  if (args.length < 1) {
    printScriptsInfo(config);
    Deno.exit();
  }
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
  const shell = resolveShell(config);
  try {
    await runCommands(commands, shell, args.slice(1), cwd);
  } catch (e) {
    log.error(`Failed at the ${bold(scriptName)} script`);
  }
}
