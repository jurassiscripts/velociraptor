import {
  parseYaml,
  path,
  existsSync,
  readFileStrSync,
} from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json", "ts"];

export interface ConfigData {
  cwd: string;
  config: ScriptsConfiguration;
}

export function loadConfig(): Promise<ConfigData | null> {
  return new Promise(async (resolve: any) => {
    let ext, name, dir = Deno.cwd();
    while (parent(dir) !== dir) {
      for (ext of CONFIG_FILE_EXTENSIONS) {
        for (name of CONFIG_FILE_NAMES) {
          const p = `${path.join(dir, name)}.${ext}`;
          if (existsSync(p)) {
            resolve({
              cwd: dir,
              config: await parseConfig(p, ext == "ts"),
            });
          }
        }
      } 
      dir = parent(dir);
    }
    resolve(null);
  });
}

function parent(dir: string) {
  return path.join(dir, "..");
}

async function parseConfig(
  configPath: string,
  isJavascript: boolean,
): Promise<ScriptsConfiguration> {
  return new Promise(async (resolve: any) => {
    if (isJavascript) {
      return resolve(await import(configPath));
    }
    return resolve(parseYaml(
      readFileStrSync(configPath, { encoding: "utf8" }),
    ) as ScriptsConfiguration);
  });
}
