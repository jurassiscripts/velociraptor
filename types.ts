export interface ScriptsConfiguration extends ScriptParameters {
  scripts: Scripts;
}

export interface Scripts {
  [key: string]: ScriptDefinition;
}

export type ScriptDefinition = Script | CompositeScript;

export type Script = string | ScriptObject;

export interface ScriptObject extends ScriptParameters {
  cmd: string | CompositeScript;
}

export type CompositeScript = Array<Script | ParallelScripts>;

export interface ParallelScripts {
  pll: Script[];
}

export interface ScriptParameters {
  env?: EnvironmentVariables;
  allow?: string[] | FlagsObject;
  v8flags?: string[] | FlagsObject;
  imap?: string;
  lock?: boolean | string;
}

export interface FlagsObject {
  [key: string]: unknown;
}

export interface EnvironmentVariables {
  [key: string]: unknown;
}

export type Permission =
  | "all"
  | "env"
  | "hrtime"
  | "net"
  | "plugin"
  | "read"
  | "run"
  | "write";

export interface Permissions {
  all?: boolean;
  env?: boolean;
  hrtime?: boolean;
  net?: boolean | string;
  plugin?: boolean;
  read?: boolean | string;
  run?: boolean;
  write?: boolean | string;
}

export interface V8Flags {
  [key: string]: any;
}

export const isScriptObject = (script: object): script is ScriptObject =>
  "cmd" in script;

export const isParallelScripts = (script: object): script is ParallelScripts =>
  "pll" in script;
