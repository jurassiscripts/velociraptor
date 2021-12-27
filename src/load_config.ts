import { existsSync, parseYaml, path } from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json", "ts"];
const CONFIG_DENO_FILE_NAMES = ["deno.json", "deno.jsonc"];

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
            config: await parseConfig(p, ext == "ts"),
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
  isTypescript: boolean,
): Promise<ScriptsConfiguration> {
  if (isTypescript) {
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
  let content = Deno.readTextFileSync(configPath);
  // Strips comments for .jsonc (credits to @tarkh)
  if (/\.jsonc$/.test(configPath)) {
    content = content.replace(
      /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
      (m, g) => g ? "" : m,
    );
  }
  const { velociraptor: config = {} } = JSON.parse(content);
  return config as ScriptsConfiguration;
}
