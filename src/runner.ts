import { blue, bold } from "https://deno.land/std/fmt/colors.ts";
import { isWindows } from "https://deno.land/std/path/constants.ts";
import {
  Command,
  ParallelCommands,
  isParallel,
  FlagsObject,
  EnvironmentVariables,
} from "./types.ts";

export async function runCommands(
  commands: Array<Command | ParallelCommands | null>,
  shell: string,
  additionalArgs: string[],
): Promise<void> {
  if (!commands) return;
  const runCommandsR = async (
    commands:
      | Command
      | ParallelCommands
      | Array<
        Command | ParallelCommands
      >,
  ): Promise<unknown> => {
    if (Array.isArray(commands)) {
      for (let command of commands) {
        await runCommandsR(command);
      }
    } else {
      if (isParallel(commands)) {
        return Promise.all(commands.pll.map((c) => runCommandsR(c)));
      }
      return runCommand(commands, shell, additionalArgs);
    }
  };
  await runCommandsR(commands as Array<Command | ParallelCommands>);
}

function insertOptions(
  command: string,
  atPosition: number,
  ...options: string[]
) {
  return command.slice(0, atPosition) + " " + options.join(" ") +
    command.slice(atPosition);
}

function generateFlagOptions(
  flags: FlagsObject,
  prefix: string = "",
): string[] {
  return Object.entries(flags).map(([k, v]) =>
    `--${prefix}${k}${v !== true ? `="${v}"` : ""}`
  );
}

async function runCommand(
  command: Command,
  shell: string,
  additionalArgs: string[],
): Promise<void> {
  let cmd = command.cmd, match;
  if (match = matchCompactRun(cmd)) {
    cmd = "deno run " + cmd;
  }
  if (match = matchDenoCommand(cmd)) { // TODO allow multiple in same script?
    const subCommand = match[1];
    const insertAt = match[0].length;
    if (["run", "install", "test"].includes(subCommand)) {
      if (command.allow) {
        const flags = generateFlagOptions(
          command.allow as FlagsObject,
          "allow-",
        );
        if (flags && flags.length > 0) {
          cmd = insertOptions(cmd, insertAt, ...flags);
        }
      }
      if (command.log) {
        cmd = insertOptions(cmd, insertAt, `--log-level=${command.log}`);
      }
      if (["run", "install"].includes(subCommand)) {
        if (command.imap) {
          cmd = insertOptions(cmd, insertAt, `--importmap="${command.imap}"`);
        }
        if (command.lock) {
          cmd = insertOptions(cmd, insertAt, `--lock="${command.lock}"`);
        }
        if (command.v8flags) {
          const flags = generateFlagOptions(command.v8flags as FlagsObject);
          if (flags && flags.length > 0) {
            cmd = insertOptions(cmd, insertAt, `--v8-flags=${flags.join(",")}`);
          }
        }
      }
    }
  }
  let runOptions: Deno.RunOptions = {
    cmd: [shell, ...buildShellArgs(shell, cmd), shell, ...additionalArgs],
  };
  if (command.env && Object.entries(command.env).length > 0) {
    runOptions.env = stringifyEnv(command.env);
  }
  console.debug(
    blue(bold(">")),
    `${cmd}${
      additionalArgs && additionalArgs.length > 0
        ? ` -- ${additionalArgs.join(" ")}`
        : ""
    }`,
  );
  const process = Deno.run(runOptions);
  const status = await process.status();
  if (status.code !== 0) {
    throw new Error(`Command returned error code`);
  }
  process.close();
}

function matchDenoCommand(command: string) {
  return command.match(/^deno +(run|install|test)/);
}

function matchCompactRun(command: string) {
  return command.match(
    /^'(?:\\'|.)*?\.ts'|^"(?:\\"|.)*?\.ts"|^(?:\\\ |\S)+\.ts/,
  );
}

function stringifyEnv(env: EnvironmentVariables): EnvironmentVariables {
  for (let key in env) {
    if (key in env) {
      env[key] = String(env[key]);
    }
  }
  return env;
}

function buildShellArgs(shell: string, command: string): string[] {
  if (isWindows && /^(?:.*\\)?cmd(?:\.exe)?$/i.test(shell)) {
    return ["/d", "/s", "/c", `"${command}"`];
  }
  return ["-c", command];
}
