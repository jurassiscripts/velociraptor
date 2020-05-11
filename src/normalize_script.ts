import {
  ScriptDefinition,
  isParallelScripts,
  ParallelScripts,
  isScriptObject,
  ScriptOptions,
} from "./scripts_config.ts";
import {
  ParallelCommands,
  Command,
  isParallel,
} from "./command.ts";
import { mergeParams } from "./merge_params.ts";

/**
 * Normalizes a script definition to a list of `Command` objects
 */
export function normalizeScript(
  script: ScriptDefinition,
  rootParams: ScriptOptions,
): Array<Command | ParallelCommands | null> {
  const res = _normalizeScript(script, rootParams);
  return Array.isArray(res) ? res : [res];
}

function _normalizeScript(
  node: ScriptDefinition | ParallelScripts,
  parentParams: ScriptOptions,
): Command | ParallelCommands | Array<Command | ParallelCommands> | null {
  if (typeof node === "string") {
    return {
      cmd: node.trim(),
      ...mergeParams(parentParams, {}),
    } as Command;
  }
  if (Array.isArray(node)) {
    return node.map((s) => _normalizeScript(s, parentParams)) as Array<
      Command | ParallelCommands
    >;
  }
  if (isParallelScripts(node)) {
    return {
      pll: node.pll.flatMap((s) => _normalizeScript(s, parentParams)),
    } as ParallelCommands;
  }
  if (isScriptObject(node)) {
    const { cmd, ...nodeParams } = node;
    return _normalizeScript(
      node.cmd,
      mergeParams(nodeParams, parentParams),
    ) as Command;
  }
  return null;
}

export function flattenCommands(
  commands: (Command | ParallelCommands | null)[],
): Command[] {
  return commands
    .filter((c) => c !== null)
    .flatMap((c) =>
      c instanceof Object && isParallel(c) ? flattenCommands(c.pll) : c
    ) as Command[];
}
