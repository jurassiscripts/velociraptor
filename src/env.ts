import { Command } from "./command.ts";
import { log } from "./logger.ts";
import { EnvironmentVariables } from "./scripts_config.ts";

const envCache: Record<string, EnvironmentVariables> = {};

export function getEnvVars(cmd: Command): EnvironmentVariables | undefined {
  const envVars: EnvironmentVariables = {};
  if (cmd.env_file) {
    Object.assign(envVars, parseEnvFile(cmd.env_file));
  }
  if (cmd.env && Object.entries(cmd.env).length > 0) {
    Object.assign(envVars, stringifyEnv(cmd.env));
  }
  if (Object.entries(envVars).length > 0) {
    return envVars;
  }
}

function parseEnvFile(envFile: string): EnvironmentVariables {
  if (envCache[envFile]) {
    return envCache[envFile];
  }
  try {
    const buffer: Uint8Array = Deno.readFileSync(envFile);
    return envCache[envFile] = new TextDecoder()
      .decode(buffer)
      .trim()
      .split(/\r?\n/g)
      .map((val: string) => val.trim())
      .filter((val: string) => val && val[0] !== "#")
      .reduce((env: EnvironmentVariables, line: string) => {
        const [name, value] = line
          .replace(/^export\s+/, "")
          .split("=", 2)
          .map((val: string) => val.trim());
        env[name] = stripeQuotes(value);
        return env;
      }, {});
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      log.error(`env_file not found: ${envFile}`);
    } else {
      log.error(`Failed to parse env_file: ${envFile}`);
    }
    throw error;
  }
}

function stripeQuotes(value: string) {
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' || first === "'") && first === last) {
    return value.slice(1, -1);
  }
  return value;
}

function stringifyEnv(env: EnvironmentVariables): EnvironmentVariables {
  for (let key in env) {
    if (key in env) {
      env[key] = String(env[key]);
    }
  }
  return env;
}
