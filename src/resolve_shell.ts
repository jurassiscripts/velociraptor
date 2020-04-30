import { isWindows } from "https://deno.land/std/path/constants.ts";
import { ScriptsConfiguration } from "./types.ts";

const OS_SHELL_ENV_NAME = isWindows ? "ComSpec" : "SHELL";
const OS_FALLBACK_SHELL = isWindows ? "cmd.exe" : "/bin/bash";

export function resolveShell(scriptsConfig: ScriptsConfiguration): string {
  let shell = scriptsConfig.shell;
  if (checkShellFile(shell)) return shell as string;
  shell = Deno.env.get(OS_SHELL_ENV_NAME);
  if (checkShellFile(shell)) return shell as string;
  return OS_FALLBACK_SHELL;
}

function checkShellFile(shell: string | undefined) {
  return shell && Deno.statSync(shell).isFile; // TODO check executable
}
