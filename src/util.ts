import { ParallelScripts, ScriptObject } from "./scripts_config.ts";

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

export async function spawn(args: string[], cwd: string): Promise<string> {
  const process = Deno.run({
    cmd: args,
    cwd,
    stdout: 'piped',
    stderr: 'null',
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
