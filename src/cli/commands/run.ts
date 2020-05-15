import { BaseCommand, HelpCommand } from "../../../deps.ts";
import { ScriptIdType } from "../script_id_type.ts";
import { ConfigData } from "../../load_config.ts";
import { runScript } from "../../run_script.ts";

export class RunCommand extends BaseCommand {
  private helpCommand = new HelpCommand(this);

  constructor(private configData: ConfigData | null) {
    super();
    this.description("Run a script")
      .type("scriptid", new ScriptIdType(this.configData))
      .arguments("<script:string:scriptid> [additionalArgs...]")
      .action(async (options, script: string, additionalArgs: string[]) => {
        await runScript(this.configData, script, additionalArgs);
      });
  }

  getHelpCommand(): HelpCommand {
    return this.helpCommand;
  }
}
