import { DenoLand, UpdateNotifier } from "../deps.ts";
import { UPGRADE_COMMAND, VR_NAME } from "./consts.ts";
import { version } from "./version.ts";

export const notifier = new UpdateNotifier({
  name: VR_NAME,
  registry: DenoLand,
  currentVersion: version,
});

export const withUpdateChecks = async (fn: () => unknown) => {
  const checkForUpdates = notifier.checkForUpdates();
  const ret = fn();
  if (ret instanceof Promise) {
    await ret;
  }
  await checkForUpdates;
  notifier.notify(UPGRADE_COMMAND);
};
