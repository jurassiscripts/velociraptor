import { Command, ParallelCommands, isParallel, FlagsObject } from "./types.ts";
import { parseCommand } from "./cmd-parser.ts";

export const runCommands = (
  commands: Array<Command | ParallelCommands | null>,
) => {
  if (!commands) return;
  console.log(Deno.inspect(commands, { depth: Infinity }));
  commands.forEach((command) => {
    if (!command) return;
    if (isParallel(command)) {
      
    }
  });
};

const injectOptions = (args: string[], ...options: string[]) => args = [
  ...args.slice(0, 2),
  ...options,
  ...args.slice(2),
];

const generateFlagOptions = (flags: FlagsObject): string[] => {
  return Object.entries(flags).map(([k, v]) => `--${k}${v !== true ? `="${v}"` : ""}`);
}

const runCommand = (command: Command)/*: Deno.Process */=> {
  let args = parseCommand(command.cmd);
  if (args[1] === "deno") {
    if (["run", "install", "test"].includes(args[2])) {
      if (command.allow) {
        const flags = generateFlagOptions(command.allow as FlagsObject);
        if (flags && flags.length > 0) injectOptions(args, ...flags);
      }
      if (command.log) {
        injectOptions(args, `--log-level=${command.log}`);
      }
      if (["run", "install"].includes(args[2])) {
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
  return Deno.run(runOptions);
};
