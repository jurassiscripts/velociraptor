import { ScriptObject } from "./scripts_config.ts";

export interface Command extends Omit<ScriptObject, "cmd"> {
  cmd: string;
}

export interface ParallelCommands {
  pll: Array<Command | ParallelCommands>;
}

export const isParallel = (command: object): command is ParallelCommands =>
  "pll" in command;
