import { bold, path, readJsonSync, __ } from "../deps.ts";

type Action = () => void;

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
    console.log(`Velociraptor
The npm run for Deno

Docs: https://github.com/umbopepato/velociraptor

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
    const { __dirname } = __(import.meta);
    const projectFilePath = path.join(__dirname, "..", "project.json");
    const project = readJsonSync(projectFilePath) as { version: string };
    console.log(project.version);
  },
});

export function handleOption(option: string) {
  if (options.has(option)) {
    const action = options.get(option);
    if (action && action.call) action();
  } else {
    throw new Error(`Unknown option ${option}`);
  }
}
