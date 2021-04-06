import { loadConfig } from "./src/load_config.ts";
import { VrCommand } from "./src/cli/commands/vr.ts";
import { version } from "./src/version.ts";
import { DenoLand, UpdateNotifier } from "./deps.ts";
import { VR_NAME } from "./src/consts.ts";

if (import.meta.main) {
  const notifier = new UpdateNotifier({
    name: VR_NAME,
    registry: DenoLand,
    currentVersion: version,
  });
  const checkForUpdates = notifier.checkForUpdates();
  const config = await loadConfig();
  new VrCommand(config).parse(Deno.args);
  await checkForUpdates;
  notifier.notify("vr upgrade");
}
