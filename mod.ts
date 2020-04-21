import {loadConfig} from './config-loader.ts';
import {parseCommand} from './cmd-parser.ts';
import {normalizeScript} from './normalize-script.ts';

if (import.meta.main) {
    const config = loadConfig();
    const args = Deno.args;
    if (args.length < 1) {
      console.log('No script provided. Choose one of');
      Deno.exit();
    }
    const scriptName = args[0];
    if (!(scriptName in config.scripts)) {
      throw new Error(`Missing script: ${scriptName}`);
    }
    const scriptDef = config.scripts[scriptName];
    const commands = normalizeScript(scriptDef);
    const cmdArgs = parseCommand();
    console.log(args);
}
