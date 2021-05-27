import { kill } from "../deps.ts";
import { getEnvVars } from "./env.ts";
import { escape, isWindows, notNull, OneOrMore } from "./util.ts";
import { log } from "./logger.ts";
import {
  Command,
  CompoundCommandItem,
  isParallel,
  ParallelCommands,
} from "./command.ts";
import { buildCommandString } from "./build_command_string.ts";
import { ArgsForwardingMode } from "./run_script.ts";

const runningProcesses: Set<Deno.Process> = new Set();

interface RunCommandsOptions {
  shell: string;
  cwd: string;
  commands: CompoundCommandItem[];
  prefix?: string;
  additionalArgs?: string[];
  argsForwardingMode?: ArgsForwardingMode;
}

export async function runCommands({
  shell,
  cwd,
  commands,
  prefix,
  additionalArgs,
  argsForwardingMode,
}: RunCommandsOptions): Promise<void> {
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
      const command = commands as Command;
      return runCommand({
        shell,
        cwd,
        command,
        prefix,
        additionalArgs,
        argsForwardingMode,
      });
    }
  };
  try {
    await _runCommands(commands as Array<Command | ParallelCommands>);
  } catch (e) {
    runningProcesses.forEach((p) => {
      kill(p.pid, { force: true, tree: true });
      p.close();
    });
    throw e;
  }
}

type RunCommandOptions = Omit<RunCommandsOptions, "commands"> & {
  command: Command;
};

async function runCommand({
  shell,
  cwd,
  command,
  prefix,
  additionalArgs,
  argsForwardingMode,
}: RunCommandOptions): Promise<void> {
  const cmd = buildCommandString(command);
  let runOptions: Deno.RunOptions = {
    cmd: [
      shell,
      ...buildShellArgs({
        shell,
        command: cmd,
        prefix,
        additionalArgs,
        argsForwardingMode,
      }),
    ],
    cwd,
    env: getEnvVars(command),
  };
  log.debug(
    `Running > ${
      [
        prefix,
        cmd,
        additionalArgs && additionalArgs.length > 0
          ? additionalArgs.join(" ")
          : null,
      ].filter(notNull).join(" ")
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

type BuildShellArgsOptions = Omit<RunCommandOptions, "command" | "cwd"> & {
  command: string;
};

function buildShellArgs({
  shell,
  command,
  prefix,
  additionalArgs,
  argsForwardingMode,
}: BuildShellArgsOptions): string[] {
  const cmd = [
    prefix,
    command,
    argsForwardingMode === ArgsForwardingMode.DIRECT && additionalArgs &&
      additionalArgs.length > 0
      ? additionalArgs.map((a) => `"${escape(a, '"')}"`).join(" ")
      : null,
  ].filter(notNull)
    .join(" ");
  if (isWindows && /^(?:.*\\)?cmd(?:\.exe)?$/i.test(shell)) {
    return ["/d", "/s", "/c", cmd];
  }
  return [
    "-c",
    cmd,
    ...(argsForwardingMode === ArgsForwardingMode.INDIRECT && additionalArgs
      ? additionalArgs
      : []),
  ];
}
