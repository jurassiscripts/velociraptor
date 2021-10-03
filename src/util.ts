import { path } from "../deps.ts";

import { ParallelScripts, Script, ScriptObject } from "./scripts_config.ts";

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

export function getScriptPrefix(shell: string): string {
  let prefix;
  const nameShell = path.basename(shell);
  switch (nameShell) {
    case "cmd.exe":
    case "powershell.exe":
      prefix = `set GIT_ARGS=("$args");`;
      break;
    case "fish":
      prefix = `set GIT_ARGS $argv;`;
      break;
    case "bash":
    case "zsh":
    default:
      prefix = `GIT_ARGS=("$@")`;
      break;
  }
  return prefix;
}

export async function spawn(args: string[], cwd?: string): Promise<string> {
  const process = Deno.run({
    cmd: args,
    cwd,
    stdout: "piped",
    stderr: "piped",
  });
  const { code } = await process.status();
  if (code === 0) {
    const rawOutput = await process.output();
    process.close();
    return new TextDecoder().decode(rawOutput);
  } else {
    const error = new TextDecoder().decode(await process.stderrOutput());
    process.close();
    throw new Error(error);
  }
}

export const isScriptObject = (script: any): script is ScriptObject =>
  script instanceof Object && "cmd" in script;

export const isParallelScripts = (script: any): script is ParallelScripts =>
  script instanceof Object && "pll" in script;

export const isMultiCompositeScript = (
  script: any,
): script is Array<Script | ParallelScripts> => Array.isArray(script);

export const notNull = (o: any) => o != null;
