import { loadConfig } from "./src/load_config.ts";
import { VrCommand } from "./src/cli/commands/vr.ts";

if (import.meta.main) {
  const config = await loadConfig();
  new VrCommand(config).parse(Deno.args);
}
