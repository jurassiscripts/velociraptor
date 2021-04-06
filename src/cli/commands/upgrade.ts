import { Command, DenoLand, semver } from "../../../deps.ts";
import { log } from "../../logger.ts";
import { version as currentVersion } from "../../version.ts";
import { VR_NAME } from "../../consts.ts";
import { spawn } from "../../util.ts";

export class UpgradeCommand extends Command {
  constructor() {
    super();
    this.description(
      "Upgrade Velociraptor to the latest version or to a specific one",
    )
      .arguments("[version:string]")
      .action(async (options, version: string | undefined) => {
        let newVersion = version;
        if (!newVersion) {
          newVersion = await DenoLand.latestVersion(VR_NAME);
        }
        if (!newVersion) {
          log.error("Cannot retrieve the latest version tag");
          return;
        }
        if (semver.eq(newVersion, currentVersion)) {
          log.info("Velociraptor is already up-to-date");
          return;
        }
        try {
          await spawn([
            "deno",
            "install",
            "--reload",
            "-qAfn",
            "vr",
            `https://deno.land/x/${VR_NAME}@${newVersion}/cli.ts`,
          ]);
          log.info(`✅ Successfully upgraded to ${newVersion}`);
        } catch (e) {
          console.log(e.message);
        }
      });
  }
}
