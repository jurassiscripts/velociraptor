import { bold } from "../deps.ts";
import { version } from "./version.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

type ConfigData = { config: ScriptsConfiguration; cwd: string };

type Action = (configData?: ConfigData) => void | Promise<void>;

const options = new Map<string, Action>();

function registerOption(
  option: { name: string; alias?: string; action: Action },
) {
  options.set(option.name, option.action);
  if (option.alias) options.set(option.alias, option.action);
}

registerOption({
  name: "--help",
  alias: "-h",
  action: () => {
    console.log(`🦖 Velociraptor
An npm-style script runner for Deno

Docs: https://deno.land/x/velociraptor

USAGE:
    vr [SCRIPT] [ADDITIONAL ARGS]...
    vr [OPTION]

OPTIONS:
    -h, --help    Shows this screen.
    -v, --version Shows the installed version number.

Run ${bold("vr")} without arguments to see a list of available scripts.`);
  },
});

registerOption({
  name: "--version",
  alias: "-v",
  action: () => {
    console.log(version);
  },
});

registerOption({
  name: "--git-hook",
  action: (configData) => {
    console.log(version);
  },
});

export async function handleOption(args: string[], configData: ConfigData) {
  const option = args[0];
  if (options.has(option)) {
    const action = options.get(option);
    if (action && action.call) {
      const ret = action(configData);
      if (ret instanceof Promise) await ret;
    }
  } else {
    throw new Error(`Unknown option ${option}`);
  }
}
