export type OneOrMore<T> = T | T[];

export const isWindows = Deno.build.os == "windows";

export function escape(str: string, ...chars: string[]): string {
  return chars.reduce(
    (str, char) => str.replace(RegExp(char, "g"), `\\${char}`),
    str,
  );
}

export function makeFileExecutable(filePath: string) {
  Deno.chmodSync(filePath, 0o0755);
}
