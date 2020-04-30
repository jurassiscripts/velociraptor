import {
  ScriptDefinition,
  isParallelScripts,
  ParallelScripts,
  isScriptObject,
  ScriptOptions,
  ParallelCommands,
  Command,
} from "./types.ts";
import { mergeParams } from "./merge_params.ts";

/**
 * Normalizes a script definition to a list of `Command` objects
 */
export function normalizeScript(
  script: ScriptDefinition,
  rootParams: ScriptOptions,
): Array<Command | ParallelCommands | null> {
  const res = normalizeScriptR(script, rootParams);
  return Array.isArray(res) ? res : [res];
}

function normalizeScriptR(
  node: ScriptDefinition | ParallelScripts,
  parentParams: ScriptOptions,
): Command | ParallelCommands | Array<Command | ParallelCommands> | null {
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
    return normalizeScriptR(
      node.cmd,
      mergeParams(nodeParams, parentParams),
    ) as Command;
  }
  return null;
}
