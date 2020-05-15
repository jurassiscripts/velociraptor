import { loadConfig } from "./src/load_config.ts";
import { VrCommand } from "./src/cli/commands/vr.ts";

if (import.meta.main) {
  const configData = loadConfig();
  await new VrCommand(configData)
    .parse(Deno.args);
}
