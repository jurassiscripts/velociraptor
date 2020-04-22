import {
  ScriptDefinition,
  ScriptObject,
  isParallelScripts,
  ParallelScripts,
  isScriptObject,
  ScriptParameters,
} from "./types.ts";
import { mergeParams } from "./merge-params.ts";

export interface Command extends Omit<ScriptObject, "cmd"> {
  cmd: string | Command[] | ParallelCommands;
}

export interface ParallelCommands {
  pll: Command[];
}

/**
 * Normalizes a script definition to a list of `Command` objects
 */
export const normalizeScript = (
  script: ScriptDefinition,
  rootParams: ScriptParameters,
): Array<Command | ParallelCommands | null> => {
  const res = normalizeScriptR(script, rootParams);
  return Array.isArray(res) ? res : [res];
};

export const normalizeScriptR = (
  node: ScriptDefinition | ParallelScripts,
  parentParams: ScriptParameters,
): Command | ParallelCommands | Array<Command | ParallelCommands> | null => {
  if (typeof node === "string") {
    return {
      cmd: node,
      ...mergeParams(parentParams, {}),
    } as Command;
  }
  if (Array.isArray(node)) {
    return node.map((s) => normalizeScriptR(s, parentParams)) as Array<
      Command | ParallelCommands
    >;
  }
  if (isParallelScripts(node)) {
    return {
      pll: node.pll.map((s) => normalizeScriptR(s, parentParams)),
    } as ParallelCommands;
  }
  if (isScriptObject(node)) {
    const { cmd, ...nodeParams } = node;
    return normalizeScriptR(node.cmd, mergeParams(nodeParams, parentParams)) as Command;
  }
  return null;
};
