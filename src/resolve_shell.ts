import { ScriptsConfiguration } from "./types.ts";

const os = Deno.build.os;
const OS_SHELL_ENV_NAME = os === "win" ? "ComSpec" : "SHELL";
const OS_FALLBACK_SHELL = os === "win" ? "cmd.exe" : "/bin/bash";

export function resolveShell(scriptsConfig: ScriptsConfiguration): string {
  let shell = scriptsConfig.shell;
  if (checkShellFile(shell)) return shell as string;
  shell = Deno.env()[OS_SHELL_ENV_NAME];
  if (checkShellFile(shell)) return shell;
  return OS_FALLBACK_SHELL;
}

function checkShellFile(shell: string | undefined) {
  return shell && Deno.statSync(shell).isFile; // TODO check executable
}
