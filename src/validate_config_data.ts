import { ConfigData } from "./load_config.ts";
import { log } from "./logger.ts";
import { isScriptObject } from "./util.ts";
import { hooks } from "./git_hooks.ts";
import { didYouMean } from "./did_you_mean.ts";
import { blue, red } from "../deps.ts";
import { ValidationError } from "../deps.ts";

export function validateConfigData(configData: ConfigData | null): ConfigData {
  if (!configData) {
    throw new ValidationError("No scripts file found.");
  }
  if (
    !configData.config?.scripts ||
    Object.entries(configData.config?.scripts).length < 1
  ) {
    log.warning(
      "No scripts available.\nSee https://velociraptor.run for guidance on how to create scripts.",
    );
    Deno.exit();
  }
  Object.entries(configData.config.scripts)
    .forEach(([id, value]) => {
      if (
        isScriptObject(value) && value.gitHook && !hooks.includes(value.gitHook)
      ) {
        log.warning(
          `Invalid git hook name ${red(value.gitHook)} in script ${blue(id)}`,
        );
        const suggestion = didYouMean(value.gitHook, hooks);
        if (suggestion) console.log(`Did you mean ${red(suggestion)}?`);
      }
    });
  return configData;
}
