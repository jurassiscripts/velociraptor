import {
  Command,
  ParallelCommands,
  isParallel,
  FlagsObject,
  EnvironmentVariables,
} from "./types.ts";
import { parseCommand } from "./cmd-parser.ts";
import { blue, bold } from "https://deno.land/std/fmt/colors.ts";

export const runCommands = async (
  commands: Array<Command | ParallelCommands | null>,
  shell: string,
): Promise<void> => {
  if (!commands) return;
  const runCommandsR = async (commands: Command | ParallelCommands | Array<
    Command | ParallelCommands
  >): Promise<unknown> => {
    if (Array.isArray(commands)) {
      for (let command of commands) {
        await runCommandsR(command);
      }
    } else {
      if (isParallel(commands)) {
        return Promise.all(commands.pll.map((c) => runCommandsR(c)));
      }
      return runCommand(commands, shell);
    }
  };
  await runCommandsR(commands as Array<Command | ParallelCommands>);
};

const insertOptions = (
  command: string,
  atPosition: number,
  ...options: string[]
) => {
  return command.slice(0, atPosition) + " " + options.join(" ") +
    command.slice(atPosition);
};

const generateFlagOptions = (
  flags: FlagsObject,
  prefix: string = "",
): string[] => {
  return Object.entries(flags).map(([k, v]) =>
    `--${prefix}${k}${v !== true ? `="${v}"` : ""}`
  );
};

const runCommand = async (command: Command, shell: string): Promise<void> => {
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
    cmd: [shell, ...buildShellArgs(shell, cmd)],
  };
  if (command.env && Object.entries(command.env).length > 0) {
    runOptions.env = stringifyEnv(command.env);
  }
  console.debug(blue(bold(">")), cmd);
  const process = Deno.run(runOptions);
  const status = await process.status();
  if (status.code !== 0) {
    throw new Error(`Command returned error code`);
  }
  process.close();
};

const matchDenoCommand = (command: string) =>
  command.match(/^deno +(run|install|test)/);

const matchCompactRun = (command: string) =>
  command.match(/^'(?:\\'|.)*?\.ts'|^"(?:\\"|.)*?\.ts"|^(?:\\\ |\S)+\.ts/);

const stringifyEnv = (env: EnvironmentVariables): EnvironmentVariables => {
  for (let key in env) {
    if (key in env) {
      env[key] = String(env[key]);
    }
  }
  return env;
};

const buildShellArgs = (shell: string, command: string) => {
  if (Deno.build.os === "win" && /^(?:.*\\)?cmd(?:\.exe)?$/i.test(shell)) {
    return ["/d", "/s", "/c", `"${command}"`];
  }
  return ["-c", command];
};
