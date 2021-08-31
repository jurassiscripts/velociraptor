import { Command, CompletionsCommand } from "../../../deps.ts";
import { version } from "../../version.ts";
import { ScriptIdType } from "../types/script_id_type.ts";
import { ConfigData } from "../../load_config.ts";
import { RunCommand } from "./run.ts";
import { ExportCommand } from "./export.ts";
import { ArgsForwardingMode, runScript } from "../../run_script.ts";
import { RunHookCommand } from "./run_hook.ts";
import { VR_HOOKS, VR_LOG, VR_SHELL } from "../../consts.ts";
import { checkGitHooks } from "../../git_hooks.ts";
import { validateConfigData } from "../../validate_config_data.ts";
import { UpgradeCommand } from "./upgrade.ts";
import { withUpdateChecks } from "../../update_notifier.ts";

export class VrCommand extends Command {
  constructor(private configData: ConfigData | null) {
    super();
    this.name("vr")
      .version(version)
      .description(
        "🦖 Velociraptor\nThe npm-style script runner for Deno\n\nDocs: https://velociraptor.run",
      )
      .env(
        `${VR_SHELL}=<value:string>`,
        "The path to a shell executable to be used for executing scripts",
      )
      .env(
        `${VR_LOG}=<value:string>`,
        "Log verbosity. One of: DEBUG, INFO, WARNING, ERROR, CRITICAL",
      )
      .env(
        `${VR_HOOKS}=<value:boolean>`,
        "If 'false', prevents velociraptor from installing and running git hooks (ie for CI)",
      )
      .type("scriptid", new ScriptIdType(this.configData), { global: true })
      .arguments("[script:scriptid] [additionalArgs...]")
      .stopEarly()
      .action((options, script: string, additionalArgs: string[]) => {
        return withUpdateChecks(async () => {
          validateConfigData(this.configData);
          await checkGitHooks(this.configData as ConfigData);
          await runScript({
            configData: this.configData!,
            script,
            additionalArgs,
            argsForwardingMode: ArgsForwardingMode.DIRECT,
          });
        });
      })
      .command("run", new RunCommand(this.configData))
      .command("run-hook", new RunHookCommand(this.configData))
      .command("export", new ExportCommand(this.configData))
      .command("upgrade", new UpgradeCommand())
      .command("completions", new CompletionsCommand().hidden())
      .reset();
  }
}
