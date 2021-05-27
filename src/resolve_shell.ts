import { isWindows } from "./util.ts";
import { VR_SHELL } from "./consts.ts";

const OS_SHELL_ENV_NAME = isWindows ? "ComSpec" : "SHELL";
const OS_FALLBACK_SHELL = isWindows ? "cmd.exe" : "sh";

export function resolveShell(): string {
  let shell = Deno.env.get(VR_SHELL);
  if (!shell && isWindows) {
    shell = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
  }
  if (validateShellFile(shell)) return shell as string;
  shell = Deno.env.get(OS_SHELL_ENV_NAME);
  if (validateShellFile(shell)) return shell as string;
  return OS_FALLBACK_SHELL;
}

function validateShellFile(shell: string | undefined) {
  try {
    return shell && Deno.statSync(shell).isFile; // TODO check executable
  } catch (e) {
    // Use fallback shell
  }
}
