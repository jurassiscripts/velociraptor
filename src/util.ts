export type OneOrMore<T> = T | T[];

export const isWindows = Deno.build.os == "windows";

export function escape(str: string, ...exp: string[]): string {
  return exp.reduce(
    (str, e) => str.replace(RegExp(e, "g"), `\\${e}`),
    str,
  );
}

export function makeFileExecutable(filePath: string) {
  try {
    Deno.chmodSync(filePath, 0o0755);
  } catch (e) {
    // Windows
  }
}

const envCache: Record<string, Record<string, string>> = {};

export function parseEnvFile(envFile: string): Record<string, string> {
  if (envCache[envFile]) {
    return Object.assign({}, envCache[envFile]);
  }
  const buffer: Uint8Array = Deno.readFileSync(envFile);
  return envCache[envFile] = new TextDecoder()
    .decode(buffer)
    .trim()
    .split(/\n+/g)
    .map(val => val.trim())
    .filter(val => val[0] !== "#")
    .reduce((env: Record<string, string>, line: string) => {
      const [name, value] = line
        .replace(/^export\s+/, "")
        .split("=", 2)
        .map(val => val.trim());
      env[name] = stripeQuotes(value);
      return env;
    }, {});
}

function stripeQuotes(value: string) {
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' || first === "'") && first === last) {
    return value.slice(1, -1);
  }
  return value;
}
