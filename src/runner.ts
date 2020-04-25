import { Command, ParallelCommands, isParallel, FlagsObject } from "./types.ts";
import { parseCommand } from "./cmd-parser.ts";
import { blue, bold } from "https://deno.land/std/fmt/colors.ts";

export const runCommands = async (
  commands: Array<Command | ParallelCommands | null>,
  parallel: boolean = false,
): Promise<void> => {
  if (!commands) return;
  console.log(Deno.inspect(commands, { depth: Infinity }));
  for (let command of commands) {
    if (!command) continue;
    if (isParallel(command)) {
      return runCommands(command.pll, true);
    }
    const process = runCommand(command);
    if (!parallel) await process.status();
  }
};

const injectOptions = (args: string[], ...options: string[]) => {
  args.splice(2, 0, ...options);
};

const generateFlagOptions = (flags: FlagsObject, prefix: string = ''): string[] => {
  return Object.entries(flags).map(([k, v]) => `--${prefix}${k}${v !== true ? `="${v}"` : ""}`);
}

const runCommand = (command: Command): Deno.Process => {
  let args = parseCommand(command.cmd);
  if (args[0] === "deno") {
    if (["run", "install", "test"].includes(args[1])) {
      if (command.allow) {
        const flags = generateFlagOptions(command.allow as FlagsObject, 'allow-');
        if (flags && flags.length > 0) injectOptions(args, ...flags);
      }
      if (command.log) {
        injectOptions(args, `--log-level=${command.log}`);
      }
      if (["run", "install"].includes(args[1])) {
        if (command.imap) injectOptions(args, `--importmap="${command.imap}"`);
        if (command.lock) injectOptions(args, `--lock="${command.lock}"`);
        if (command.v8flags) {
          const flags = generateFlagOptions(command.v8flags as FlagsObject);
          if (flags && flags.length > 0) injectOptions(args, `--v8-flags=${flags.join(',')}`);
        }
      }
    }
  }
  let runOptions: Deno.RunOptions = {
    cmd: args,
  };
  if (command.env && Object.entries(command.env).length > 0) {
    runOptions.env = command.env;
  }
  console.debug(blue(bold('Running >')), args.join(' '));
  return Deno.run(runOptions);
};
