import { existsSync, parseYaml, path } from "../deps.ts";
import { ScriptsConfiguration } from "./scripts_config.ts";

const CONFIG_FILE_NAMES = ["scripts", "velociraptor"];
const CONFIG_FILE_EXTENSIONS = ["yaml", "yml", "json", "ts"];

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
