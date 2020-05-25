import { Command } from "../../../deps.ts";
import { version } from "../../version.ts";
import { ScriptIdType } from "../script_id_type.ts";
import { ConfigData } from "../../load_config.ts";
import { RunCommand } from "./run.ts";
import { ExportCommand } from "./export.ts";
import { runScript } from "../../run_script.ts";

export class VrCommand extends Command {
  // protected name = "vr"; // TODO replace with the actual cmd name https://github.com/denoland/deno/issues/5725
  // protected path: string = this.name;

  constructor(private configData: ConfigData | null) {
    super();
    this.name("vr")
      .version(version)
      .description(
        "🦖 Velociraptor\nAn npm-style script runner for Deno\n\nDocs: https://github.com/umbopepato/velociraptor",
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
      .arguments("[script:scriptid] [additionalArgs...]")
      .useRawArgs()
      .action(async (options, script: string, ...additionalArgs: string[]) => {
        if (["-v", "--version"].includes(script)) { // TODO find a way to avoid this
          console.log(version);
          return;
        }
        await runScript(this.configData, script, additionalArgs);
      })
      .command("run", new RunCommand(this.configData))
      .command("export", new ExportCommand(this.configData))
      .reset();
  }
}
