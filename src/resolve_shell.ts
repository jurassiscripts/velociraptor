import { isWindows } from "./util.ts";

const SHELL_ENV_NAME = "VR_SHELL";
const OS_SHELL_ENV_NAME = isWindows ? "ComSpec" : "SHELL";
const OS_FALLBACK_SHELL = isWindows ? "cmd.exe" : "sh";

export function resolveShell(): string {
  let shell = Deno.env.get(SHELL_ENV_NAME);
  if (checkShellFile(shell)) return shell as string;
  shell = Deno.env.get(OS_SHELL_ENV_NAME);
  if (checkShellFile(shell)) return shell as string;
  return OS_FALLBACK_SHELL;
}

function checkShellFile(shell: string | undefined) {
  try {
    return shell && Deno.statSync(shell).isFile; // TODO check executable
  } catch (e) {
    // use fallback shell
  }
}
