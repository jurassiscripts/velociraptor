import { parse as parseYaml } from "https://deno.land/std/encoding/yaml.ts";
import {
  readJsonSync,
  readFileStrSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { ScriptsConfiguration } from "./types.ts";

const CONFIG_FILE_NAME = "scripts";
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json"];

export function loadConfig(): ScriptsConfiguration {
  let ext, dir = Deno.cwd();
  while (parent(dir) !== dir) {
    for (ext of CONFIG_FILE_EXTENSIONS) {
      const p = `${path.join(dir, CONFIG_FILE_NAME)}.${ext}`;
      if (existsSync(p)) {
        return parseConfig(p);
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
