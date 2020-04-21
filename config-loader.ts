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

export const loadConfig = (): ScriptsConfiguration => {
  const configNoExt = path.join(Deno.cwd(), CONFIG_FILE_NAME);
  let configPath, ext;
  for (ext of CONFIG_FILE_EXTENSIONS) {
    const p = `${configNoExt}.${ext}`;
    if (existsSync(p)) {
      configPath = p;
      break;
    }
  }
  if (configPath == null) {
    throw new Error("No scripts file found in the current directory.");
  }
  if ((<string> ext).match(/ya?ml/)) {
    return parseYaml(
      readFileStrSync(configPath, { encoding: "utf8" }),
    ) as ScriptsConfiguration;
  }
  return readJsonSync(configPath) as ScriptsConfiguration;
};
