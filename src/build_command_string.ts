import { Command } from "./command.ts";
import { FlagsObject, ScriptOptions } from "./scripts_config.ts";
import { escape } from "./util.ts";

enum DenoOptions {
  allow = "allow",
  cachedOnly = "cachedOnly",
  cert = "cert",
  importmap = "importmap",
  inspect = "inspect",
  inspectBrk = "inspectBrk",
  lock = "lock",
  log = "log",
  noCheck = "noCheck",
  noRemote = "noRemote",
  quiet = "quiet",
  reload = "reload",
  tsconfig = "tsconfig",
  unstable = "unstable",
  v8Flags = "v8Flags",
  watch = "watch",
  shuffle = "shuffle",
}

const denoCmdOptions: { [key: string]: DenoOptions[] } = {
  bundle: [
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
  ],
  install: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
  ],
  run: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
    DenoOptions.watch,
  ],
  test: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
    DenoOptions.shuffle,
  ],
  cache: [
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
  ],
  doc: [
    DenoOptions.importmap,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.unstable,
  ],
  eval: [
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
  ],
  repl: [
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
  ],
  fmt: [
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
  ],
  lint: [
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
  ],
  types: [
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
  ],
  info: [
    DenoOptions.cert,
    DenoOptions.importmap,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.unstable,
  ],
};

const denoOption: Record<DenoOptions, string> = {
  ...DenoOptions,
  [DenoOptions.allow]: "allow-",
  [DenoOptions.importmap]: "importmap",
  [DenoOptions.inspectBrk]: "inspect-brk",
  [DenoOptions.log]: "log-level",
  [DenoOptions.tsconfig]: "config",
  [DenoOptions.v8Flags]: "v8-flags",
  [DenoOptions.noCheck]: "no-check",
  [DenoOptions.noRemote]: "no-remote",
  [DenoOptions.cachedOnly]: "cached-only",
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
          switch (optionName) {
            case DenoOptions.allow: {
              const flags = generateFlagOptions(
                option as FlagsObject,
                denoOption[optionName],
              );
              if (flags && flags.length > 0) {
                cmd = insertOptions(cmd, insertAt, ...flags);
              }
              break;
            }

            case DenoOptions.v8Flags: {
              const flags = generateFlagOptions(option as FlagsObject);
              if (flags && flags.length > 0) {
                cmd = insertOptions(
                  cmd,
                  insertAt,
                  `--${denoOption[optionName]}=${flags.join(",")}`,
                );
              }
              break;
            }

            case DenoOptions.cachedOnly:
            case DenoOptions.noCheck:
            case DenoOptions.noRemote:
            case DenoOptions.quiet:
            case DenoOptions.unstable:
            case DenoOptions.watch: {
              if (option === true) {
                cmd = insertOptions(
                  cmd,
                  insertAt,
                  `--${denoOption[optionName]}`,
                );
              }
              break;
            }

            case DenoOptions.reload: {
              if (option === true) {
                cmd = insertOptions(
                  cmd,
                  insertAt,
                  `--${denoOption[optionName]}`,
                );
              } else if (typeof option === "string") {
                cmd = insertOptions(
                  cmd,
                  insertAt,
                  `--${denoOption[optionName]}=${escapeCliOption(option)}`,
                );
              } else if (Array.isArray(option)) {
                cmd = insertOptions(
                  cmd,
                  insertAt,
                  `--${denoOption[optionName]}=${
                    (<string[]> option).map(escapeCliOption).join(",")
                  }`,
                );
              }
              break;
            }

            default:
              cmd = insertOptions(
                cmd,
                insertAt,
                `--${denoOption[optionName]}=${
                  escapeCliOption(option as string)
                }`,
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
    `--${prefix}${k}${v !== true ? `="${escapeCliOption(v.toString())}"` : ""}`
  );
}

function matchDenoCommand(command: string) {
  return command.match(/^deno +(\w+)/);
}

function matchCompactRun(command: string) {
  return command.match(
    /^'(?:\\'|.)*?\.[tj]s'|^"(?:\\"|.)*?\.[tj]s"|^(?:\\\ |\S)+\.[tj]s/,
  );
}

function escapeCliOption(option: string) {
  return escape(option, '"', " ");
}
