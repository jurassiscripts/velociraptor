import { getEnvVars } from "./env.ts";
import { escape, isWindows, OneOrMore } from "./util.ts";
import { log } from "./logger.ts";
import { EnvironmentVariables } from "./scripts_config.ts";
import {
  Command,
  CompoundCommandItem,
  isParallel,
  ParallelCommands,
} from "./command.ts";
import { buildCommandString } from "./build_command_string.ts";

const runningProcesses: Set<Deno.Process> = new Set();

export async function runCommands(
  commands: CompoundCommandItem[],
  shell: string,
  additionalArgs: string[],
  cwd: string,
): Promise<void> {
  const _runCommands = async (
    commands: OneOrMore<CompoundCommandItem>,
  ): Promise<unknown> => {
    if (!commands) return;
    if (Array.isArray(commands)) {
      for (let command of commands) {
        await _runCommands(command);
      }
    } else {
      if (isParallel(commands)) {
        return Promise.all(commands.pll.map((c) => _runCommands(c)));
      }
      return runCommand(commands, shell, additionalArgs, cwd);
    }
  };
  try {
    await _runCommands(commands as Array<Command | ParallelCommands>);
  } catch (e) {
    runningProcesses.forEach((p) => p.close());
    throw e;
  }
}

async function runCommand(
  command: Command,
  shell: string,
  additionalArgs: string[],
  cwd: string,
): Promise<void> {
  const cmd = buildCommandString(command);
  let runOptions: Deno.RunOptions = {
    cmd: [shell, ...buildShellArgs(shell, cmd, additionalArgs)],
    cwd,
    env: getEnvVars(command),
  };
  log.info(
    `Running > ${cmd}${
      additionalArgs && additionalArgs.length > 0
        ? ` -- ${additionalArgs.join(" ")}`
        : ""
    }`,
  );
  const process = Deno.run(runOptions);
  runningProcesses.add(process);
  const status = await process.status();
  process.close();
  runningProcesses.delete(process);
  if (status.code !== 0) {
    throw new Error(`Command returned error code ${status.code}`);
  }
}

function buildShellArgs(
  shell: string,
  command: string,
  additionalArgs: string[],
): string[] {
  const fullCmd = additionalArgs.length < 1
    ? command
    : `${command} ${
      additionalArgs.map((a) => `"${escape(a, '"')}"`).join(" ")
    }`;
  if (isWindows && /^(?:.*\\)?cmd(?:\.exe)?$/i.test(shell)) {
    return ["/d", "/s", "/c", fullCmd];
  }
  return ["-c", fullCmd];
}
