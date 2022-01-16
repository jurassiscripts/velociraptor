import { existsSync, parseYaml, path } from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const STATIC_CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json"];
const DYNAMIC_CONFIG_FILE_EXTENSIONS = ["ts", "js", "mjs"];
const CONFIG_FILE_EXTENSIONS = [...STATIC_CONFIG_FILE_EXTENSIONS, ...DYNAMIC_CONFIG_FILE_EXTENSIONS];

export interface ConfigData {
  cwd: string;
  config: ScriptsConfiguration;
}

export async function loadConfig(): Promise<ConfigData | null> {
  let ext, name, dir = Deno.cwd();
  while (parent(dir) !== dir) {
    for (ext of CONFIG_FILE_EXTENSIONS) {
      for (name of CONFIG_FILE_NAMES) {
        const p = `${path.join(dir, name)}.${ext}`;
        if (existsSync(p)) {
          return {
            cwd: dir,
            config: await parseConfig(p, DYNAMIC_CONFIG_FILE_EXTENSIONS.includes(ext)),
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

async function parseConfig(
  configPath: string,
  isDynamic: boolean,
): Promise<ScriptsConfiguration> {
  if (isDynamic) {
    return (await import(`file://${configPath}`))
      .default as ScriptsConfiguration;
  }
  return parseYaml(
    Deno.readTextFileSync(configPath),
  ) as ScriptsConfiguration;
}
