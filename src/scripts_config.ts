/**
 * Script file model
 */
export interface ScriptsConfiguration extends ScriptOptions {
  scripts: Scripts;
}

/**
 * The scripts object.
 * Keys are script identifiers, values are `ScriptDefinition`s.
 *
 * ```yaml
 * # scripts.yaml
 * scripts:
 *  start: deno run server.ts
 *  test: deno test
 * ```
 */
export type Scripts = Record<string, ScriptDefinition>;

/**
 * Either a script or a list of scripts
 */
export type ScriptDefinition = Script | CompositeScript;

/**
 * Either a command string or an object representing the script
 */
export type Script = string | ScriptObject;

/**
 * An object representing the script
 */
export interface ScriptObject extends ScriptOptions {
  /**
   * A command or list of commands
   */
  cmd: string | CompositeScript;
  /**
   * A textual description of what this script does.
   * This will be shown in the list of available scripts,
   * when calling `vr` without arguments.
   *
   * **Note** nested `ScriptObject`'s `desc` are ignored
   */
  desc?: string;
}

/**
 * An array of scripts or an object representing script
 * to be executed in parallel
 */
export type CompositeScript = ParallelScripts | Array<Script | ParallelScripts>;

/**
 * An object representing scripts
 * to be executed in parallel
 */
export interface ParallelScripts {
  /**
   * The list of script to be executed in parallel
   */
  pll: Script[];
}

/**
 * Additional script options
 *
 * These can be applied both in `ScriptObject`s and at top-level
 * in which case they're applied to all the scripts defined in the file
 */
export interface ScriptOptions extends DenoCliOptions {
  /**
   * A file with a list of environment variables to be passed to the script
   */
  env_file?: Array<string>;
  /**
   * A map of environment variables to be passed to the script
   */
  env?: EnvironmentVariables;
}

export interface DenoCliOptions {
  /**
   * A list of boolean `--allow-*` deno cli options or
   * a map of option names to values
   *
   * ```yaml
   * # scripts.yaml
   * scripts:
   *  start: deno run server.ts
   *  allow:
   *    - net
   *    - read
   * ```
   */
  allow?: Array<keyof AllowFlags> | AllowFlags;

  /**
   * Require that remote dependencies are already cached
   */
  cachedOnly?: boolean;

  /**
   * The path to a PEM certificate file,
   * passed to deno cli's `--cert` option.
   */
  cert?: string;

  /**
   * The path to an importmap json file,
   * passed to deno cli's `--importmap` option.
   *
   * **Note** This currently requires the `--unstable` flag
   */
  imap?: string;

  /**
   * The hostname and port where to start the inspector,
   * passed to deno cli's `--inspect` option.
   */
  inspect?: string;

  /**
   * Same as `inspect`, but breaks at start of user script.
   */
  inspectBrk?: string;

  /**
   * The path to an _existing_ lockfile,
   * passed to deno cli's `--lock` option.
   *
   * **Note** This doesn't create the lockfile, use `--lock-write` manually
   * when appropriate
   */
  lock?: string;

  /**
   * The log level, passed to deno cli's `--log-level` option.
   */
  log?: string;

  /**
   * Skip type checking modules
   */
  noCheck?: boolean;

  /**
   * Do not resolve remote modules
   */
  noRemote?: boolean;

  /**
   * Suppress diagnostic output
   */
  quiet?: boolean;

  /**
   * Reload source code cache (recompile TypeScript)
   */
  reload?: boolean | string | string[];

  /**
   * The path to a tsconfig json file,
   * passed to deno cli's `--tsconfig` option.
   */
  tsconfig?: string;

  /**
   * Enable unstable APIs
   */
  unstable?: boolean;

  /**
   * A list of boolean V8 flags or
   * a map of V8 option names to values
   *
   * ```yaml
   * # scripts.yaml
   * scripts:
   *  start: deno run server.ts
   *  v8Flags:
   *    - expose-gc
   *    - async-stack-trace
   * ```
   */
  v8Flags?: string[] | FlagsObject;

  /**
   * Watch for file changes and restart process automatically
   */
  watch?: boolean;
}

export interface AllowFlags {
  all?: boolean;
  env?: boolean;
  hrtime?: boolean;
  net?: string | boolean;
  plugin?: boolean;
  read?: string | boolean;
  run?: boolean;
}

export type FlagsObject = Record<string, any>;

export type EnvironmentVariables = Record<string, string>;

export const isScriptObject = (script: object): script is ScriptObject =>
  "cmd" in script;

export const isParallelScripts = (script: object): script is ParallelScripts =>
  "pll" in script;
