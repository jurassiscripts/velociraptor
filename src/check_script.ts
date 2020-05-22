import { log } from "./logger.ts";
import { bold } from "../deps.ts";
import { didYouMean } from "./did_you_mean.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

export function checkScript(script: string, config: ScriptsConfiguration) {
  if (!(script in config.scripts)) {
    log.error(`Script ${bold(script)} not found`);
    const suggestion = didYouMean(script, config.scripts);
    if (suggestion) console.log(`Did you mean ${bold(suggestion)}?`);
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
