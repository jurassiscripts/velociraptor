import { Command } from "./command.ts";
import { FlagsObject, ScriptOptions } from "./scripts_config.ts";
import { escape } from "./util.ts";
import { log } from "./logger.ts";

export enum DenoOptions {
  allow = "allow",
  cachedOnly = "cachedOnly",
  cert = "cert",
  config = "config",
  importMap = "importMap",
  imap = "imap",
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

export const denoCmdOptions: Record<string, DenoOptions[]> = {
  bundle: [
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.tsconfig,
    DenoOptions.unstable,
    DenoOptions.watch,
  ],
  install: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
  compile: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
    DenoOptions.lock,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.unstable,
    DenoOptions.v8Flags,
  ],
  test: [
    DenoOptions.allow,
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
    DenoOptions.importMap,
    DenoOptions.imap,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.unstable,
  ],
  eval: [
    DenoOptions.cachedOnly,
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
    DenoOptions.config,
    DenoOptions.importMap,
    DenoOptions.imap,
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
    DenoOptions.config,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
    DenoOptions.watch,
  ],
  lint: [
    DenoOptions.config,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
    DenoOptions.watch,
  ],
  types: [
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.unstable,
  ],
  info: [
    DenoOptions.cert,
    DenoOptions.importMap,
    DenoOptions.imap,
    DenoOptions.log,
    DenoOptions.quiet,
    DenoOptions.reload,
    DenoOptions.unstable,
  ],
};

export const denoOption: Record<DenoOptions, string> = {
  ...DenoOptions,
  [DenoOptions.allow]: "allow-",
  [DenoOptions.importMap]: "import-map",
  [DenoOptions.imap]: "import-map",
  [DenoOptions.inspectBrk]: "inspect-brk",
  [DenoOptions.log]: "log-level",
  [DenoOptions.tsconfig]: "config",
  [DenoOptions.v8Flags]: "v8-flags",
  [DenoOptions.noCheck]: "no-check",
  [DenoOptions.noRemote]: "no-remote",
  [DenoOptions.cachedOnly]: "cached-only",
};

export const optionTypes = {
  multiArgObject: [DenoOptions.allow],
  singleArgObject: [DenoOptions.v8Flags],
  boolean: [
    DenoOptions.cachedOnly,
    DenoOptions.noCheck,
    DenoOptions.noRemote,
    DenoOptions.quiet,
    DenoOptions.unstable,
    DenoOptions.watch,
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.reload,
    DenoOptions.watch,
  ],
  string: [
    DenoOptions.inspect,
    DenoOptions.inspectBrk,
    DenoOptions.reload,
    DenoOptions.watch,
    DenoOptions.cert,
    DenoOptions.config,
    DenoOptions.tsconfig,
    DenoOptions.importMap,
    DenoOptions.imap,
    DenoOptions.lock,
    DenoOptions.log,
    DenoOptions.shuffle,
  ],
  strings: [
    DenoOptions.reload,
    DenoOptions.watch,
  ],
};

const deprecatedOptionNames = {
  [DenoOptions.imap]: DenoOptions.importMap,
  [DenoOptions.tsconfig]: DenoOptions.config,
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
      for (const optionName of options) {
        const option = command[optionName as keyof ScriptOptions];
        if (option) {
          if (optionName in deprecatedOptionNames) {
            const newName =
              deprecatedOptionNames[
                optionName as keyof typeof deprecatedOptionNames
              ];
            log.warning(
              `The \`${optionName}\` option is deprecated in favor of \`${newName}\`. Please use \`${newName}\` going forward as \`${optionName}\` will be removed with the release of 2.0.0.`,
            );
          }

          if (optionTypes.multiArgObject.includes(optionName)) {
            const flags = generateFlagOptions(
              option as FlagsObject,
              denoOption[optionName],
            );
            if (flags && flags.length > 0) {
              cmd = insertOptions(cmd, insertAt, ...flags);
            }
            continue;
          }

          if (optionTypes.singleArgObject.includes(optionName)) {
            const flags = generateFlagOptions(option as FlagsObject);
            if (flags && flags.length > 0) {
              cmd = insertOptions(
                cmd,
                insertAt,
                `--${denoOption[optionName]}=${flags.join(",")}`,
              );
            }
            continue;
          }

          if (optionTypes.boolean.includes(optionName) && option === true) {
            cmd = insertOptions(
              cmd,
              insertAt,
              `--${denoOption[optionName]}`,
            );
            continue;
          }

          if (
            optionTypes.string.includes(optionName) &&
            typeof option === "string"
          ) {
            cmd = insertOptions(
              cmd,
              insertAt,
              `--${denoOption[optionName]}=${escapeCliOption(option)}`,
            );
            continue;
          }

          if (
            optionTypes.strings.includes(optionName) && Array.isArray(option)
          ) {
            cmd = insertOptions(
              cmd,
              insertAt,
              `--${denoOption[optionName]}=${
                option.map(escapeCliOption).join(",")
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
  prefix = "",
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
