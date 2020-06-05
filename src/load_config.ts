import {
  parseYaml,
  path,
  existsSync,
  readFileStrSync,
} from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json", "js"];

export interface ConfigData {
  cwd: string;
  config: ScriptsConfiguration;
}

export function loadConfig(): ConfigData | null {
  let ext, name, dir = Deno.cwd();
  while (parent(dir) !== dir) {
    for (ext of CONFIG_FILE_EXTENSIONS) {
      for (name of CONFIG_FILE_NAMES) {
        const p = `${path.join(dir, name)}.${ext}`;
        if (existsSync(p)) {
          return {
            cwd: dir,
            config: ext == "js" ? parseJavascriptConfig(p) : parseConfig(p),
          };
        }
      }
    }
    dir = parent(dir);
  }
  return null;
}

function parent(dir: string) {
  return path.join(dir, "..");
}

function parseJavascriptConfig(configPath: string): ScriptsConfiguration {
  return import(configPath);
}

function parseConfig(configPath: string): ScriptsConfiguration {
  return parseYaml(
    readFileStrSync(configPath, { encoding: "utf8" }),
  ) as ScriptsConfiguration;
}
