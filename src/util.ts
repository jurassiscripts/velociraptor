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
  } catch {
    // Windows
  }
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

export const isScriptObject = (script: unknown): script is ScriptObject =>
  script instanceof Object && "cmd" in script;

export const isParallelScripts = (script: unknown): script is ParallelScripts =>
  script instanceof Object && "pll" in script;

export const isMultiCompositeScript = (
  script: unknown,
): script is Array<Script | ParallelScripts> => Array.isArray(script);

export const notNull = (o: unknown) => o != null;
