import { loadConfig } from "./src/config_loader.ts";
import { normalizeScript } from "./src/normalize_script.ts";
import { runCommands } from "./src/runner.ts";
import { resolveShell } from "./src/resolve_shell.ts";

async function main() {
  const config = loadConfig();
  const args = Deno.args;
  if (args.length < 1) {
    console.log("No script provided. Choose one of");
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
  // try {
  await runCommands(commands, shell, args.slice(1));
  // } catch (e) {
  // throw new Error(`Failed at the ${scriptName} script`);
  // }
}

if (import.meta.main) {
  main();
}
