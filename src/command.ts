import { ScriptObject } from "./scripts_config.ts";

export interface Command extends ScriptObject {
  cmd: string;
}

export interface ParallelCommands {
  pll: Array<Command | ParallelCommands>;
}

export type CompoundCommandItem = Command | ParallelCommands | null;

export const isParallel = (
  command: Command | ParallelCommands,
): command is ParallelCommands => "pll" in command;
