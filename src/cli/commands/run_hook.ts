import { Command } from "../../../deps.ts";
import { ConfigData } from "../../load_config.ts";
import { ArgsForwardingMode, runScript } from "../../run_script.ts";
import { VR_HOOKS } from "../../consts.ts";
import { validateConfigData } from "../../validate_config_data.ts";
import { getScriptPrefix, isScriptObject } from "../../util.ts";
import { resolveShell } from "../../resolve_shell.ts";

const shell = resolveShell();

export class RunHookCommand extends Command {
  constructor(private configData: ConfigData | null) {
    super();
    this.description("Run a git hook")
      .hidden()
      .arguments("<hook:string> [args...]")
      .useRawArgs()
      .action(async (_, hook: string, ...args: string[]) => {
        validateConfigData(this.configData);
        if (Deno.env.get(VR_HOOKS) !== "false" && this.configData) {
          const script = Object.entries(this.configData.config.scripts)
            .find(([_, value]) =>
              isScriptObject(value) &&
              value.gitHook === hook
            );
          if (script) {
            const scriptPrefix = getScriptPrefix(shell);
            await runScript({
              configData: this.configData!,
              script: script[0],
              prefix: scriptPrefix,
              additionalArgs: args,
              argsForwardingMode: ArgsForwardingMode.INDIRECT,
            });
          }
        }
      });
  }
}
