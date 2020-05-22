import { BaseCommand, HelpCommand } from "../../../deps.ts";
import { ScriptIdType } from "../script_id_type.ts";
import { ConfigData } from "../../load_config.ts";
import { exportScripts } from "../../export_scripts.ts";

export class ExportCommand extends BaseCommand {
  private helpCommand = new HelpCommand(this);

  constructor(private configData: ConfigData | null) {
    super();
    this.description("Export one or more scripts as executable files")
      .type("scriptid", new ScriptIdType(this.configData))
      .arguments("[scripts...:string:scriptid]")
      .option(
        "-o, --out-dir [dir:string]",
        "The folder where the scripts will be exported",
      )
      .action(async (options, scripts: string[]) => {
        await exportScripts(this.configData, scripts, options.outDir);
      });
  }

  getHelpCommand(): HelpCommand {
    return this.helpCommand;
  }
}
