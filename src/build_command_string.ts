import { Command } from "./command.ts";
import { FlagsObject, ScriptOptions } from "./scripts_config.ts";

const denoCmdOptions: { [key: string]: string[] } = {
  bundle: ["cert", "imap", "log"],
  cache: ["cert", "tsconfig", "imap", "lock", "log"],
  install: ["allow", "log"],
  run: [
    "allow",
    "cert",
    "tsconfig",
    "imap",
    "inspect",
    "inspectBrk",
    "lock",
    "log",
    "v8Flags",
  ],
  test: [
    "allow",
    "cert",
    "tsconfig",
    "imap",
    "inspect",
    "inspectBrk",
    "lock",
    "log",
    "v8Flags",
  ],
};

const denoOption: { [key: string]: string } = {
  allow: "allow-",
  cert: "cert",
  imap: "importmap",
  inspect: "inspect",
  inspectBrk: "inspect-brk",
  lock: "lock",
  log: "log-level",
  tsconfig: "config",
  v8Flags: "v8-flags",
};

export function buildCommandString(command: Command): string {
  let cmd = command.cmd.concat(), match;
  if (match = matchCompactRun(cmd)) {
    cmd = "deno run " + cmd;
  }
  if (match = matchDenoCommand(cmd)) {
    const subCommand = match[1];
    if (subCommand && subCommand in denoCmdOptions) {
      const insertAt = match[0].length;
      const options = denoCmdOptions[subCommand];
      for (let optionName of options) {
        const option = command[optionName as keyof ScriptOptions];
        if (option) {
          if (optionName === "allow") {
            const flags = generateFlagOptions(
              option as FlagsObject,
              denoOption[optionName],
            );
            if (flags && flags.length > 0) {
              cmd = insertOptions(cmd, insertAt, ...flags);
            }
          } else if (optionName === "v8Flags") {
            const flags = generateFlagOptions(option as FlagsObject);
            if (flags && flags.length > 0) {
              cmd = insertOptions(
                cmd,
                insertAt,
                `--${denoOption[optionName]}=${flags.join(",")}`,
              );
            }
          } else {
            cmd = insertOptions(
              cmd,
              insertAt,
              `--${denoOption[optionName]}=${option}`,
            );
          }
        }
      }
    }
  }
  return cmd;
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

function matchDenoCommand(command: string) {
  return command.match(/^deno +(\w+)/);
}

function matchCompactRun(command: string) {
  return command.match(
    /^'(?:\\'|.)*?\.ts'|^"(?:\\"|.)*?\.ts"|^(?:\\\ |\S)+\.ts/,
  );
}
