import { existsSync, parseYaml, path, parseJson } from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const STATIC_CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json"];
const DYNAMIC_CONFIG_FILE_EXTENSIONS = ["ts", "js", "mjs"];
const CONFIG_DENO_FILE_NAMES = ["deno.json", "deno.jsonc"];
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
    for (const file of CONFIG_DENO_FILE_NAMES) {
      const p = path.join(dir, file);
      if (existsSync(p)) {
        return {
          cwd: dir,
          config: await parseDenoConfig(p),
        };
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

async function parseDenoConfig(
  configPath: string,
): Promise<ScriptsConfiguration> {
  const content = Deno.readTextFileSync(configPath);
  const { velociraptor: config = {} } = parseJson(content);
  return config as ScriptsConfiguration;
}
