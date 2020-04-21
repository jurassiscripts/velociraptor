import { ScriptDefinition, ScriptObject, isParallelScripts } from "./types.ts";

export const normalizeScript = (script: ScriptDefinition): ScriptObject[] => {
  if (typeof script === 'string') {
    return [{
      cmd: script,
    }];
  }
  if (Array.isArray(script)) {
    return script.map(c => normalizeScript(c));
  }
  if (isParallelScripts(script))
};
