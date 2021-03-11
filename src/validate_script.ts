import { log } from "./logger.ts";
import { blue, bold } from "../deps.ts";
import { didYouMean } from "./did_you_mean.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

export function validateScript(script: string, config: ScriptsConfiguration) {
  if (!(script in config.scripts)) {
    log.error(`Script ${blue(script)} not found`);
    const suggestion = didYouMean(script, Object.keys(config.scripts));
    if (suggestion) console.log(`Did you mean ${blue(suggestion)}?`);
    else {
      console.log(
        `Run ${
          bold("vr")
        } without arguments to see a list of available scripts.`,
      );
    }
    Deno.exit();
  }
}
