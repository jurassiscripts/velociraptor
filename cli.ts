import { loadConfig } from "./src/load_config.ts";
import { VrCommand } from "./src/cli/commands/vr.ts";

if (import.meta.main) {
  loadConfig().then(async (conf) => {
    await new VrCommand(conf)
      .parse(Deno.args);
  });
}
