import { Command } from "../../../deps.ts";
import { version } from "../../version.ts";
import { ScriptIdType } from "../script_id_type.ts";
import { ConfigData } from "../../load_config.ts";
import { RunCommand } from "./run.ts";
import { runScript } from "../../run_script.ts";

export class VrCommand extends Command {
  protected name = "vr"; // TODO replace with the actual cmd name when it'll be possible
  protected path: string = this.name;

  constructor(private configData: ConfigData | null) {
    super();
    this.version(version)
      .description(
        "🦖 Velociraptor\nAn npm-style script runner for Deno\n\nDocs: https://deno.land/x/velociraptor",
      )
      .env(
        "VR_SHELL=<value:string>",
        "The path to a shell executable to be used for executing scripts",
      )
      .env(
        "VR_LOG=<value:string>",
        "Log verbosity. One of: DEBUG, INFO, WARNING, ERROR, CRITICAL",
      )
      .type("scriptid", new ScriptIdType(this.configData))
      .arguments("[script:string:scriptid] [additionalArgs...]")
      .action(async (options, script: string, additionalArgs: string[]) => {
        await runScript(this.configData, script, additionalArgs);
      })
      .command("run", new RunCommand(this.configData))
      .reset();
  }
}
