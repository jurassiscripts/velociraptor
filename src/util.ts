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
