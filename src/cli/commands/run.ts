import { Command } from "../../../deps.ts";
import { ConfigData } from "../../load_config.ts";
import { runScript } from "../../run_script.ts";
import { checkGitHooks } from "../../git_hooks.ts";
import { validateConfigData } from "../../validate_config_data.ts";

export class RunCommand extends Command {
  constructor(private configData: ConfigData | null) {
    super();
    this.description("Run a script")
      .arguments("<script:scriptid> [additionalArgs...]")
      .useRawArgs()
      .action(async (options, script: string, ...additionalArgs: string[]) => {
        if (script === "--help" || script === "-h") {
          console.log(this.getHelp());
          return;
        }
        validateConfigData(this.configData);
        await checkGitHooks(this.configData as ConfigData);
        await runScript(this.configData as ConfigData, script, additionalArgs);
      });
  }
}
