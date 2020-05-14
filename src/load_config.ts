import {
  parseYaml,
  readJsonSync,
  readFileStrSync,
  existsSync,
  path,
} from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json"];

export function loadConfig(): { cwd: string; config: ScriptsConfiguration } {
  let ext, name, dir = Deno.cwd();
  while (parent(dir) !== dir) {
    for (ext of CONFIG_FILE_EXTENSIONS) {
      for (name of  CONFIG_FILE_NAMES) {
        const p = `${path.join(dir, name)}.${ext}`;
        if (existsSync(p)) {
          return {
            cwd: dir,
            config: parseConfig(p),
          };
        }
      }
    }
    dir = parent(dir);
  }
  throw new Error("No scripts file found.");
}

function parent(dir: string) {
  return path.join(dir, "..");
}

function parseConfig(configPath: string): ScriptsConfiguration {
  if (/ya?ml$/.test(configPath)) {
    return parseYaml(
      readFileStrSync(configPath, { encoding: "utf8" }),
    ) as ScriptsConfiguration;
  }
  return readJsonSync(configPath) as ScriptsConfiguration;
}
