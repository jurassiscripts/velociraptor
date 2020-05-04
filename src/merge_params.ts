import { ScriptOptions, FlagsObject } from "./scripts_config.ts";

export function mergeParams(
  parentParams: ScriptOptions,
  childParams: ScriptOptions,
): ScriptOptions {
  return {
    ...parentParams,
    ...childParams,
    env: {
      ...parentParams.env,
      ...childParams.env,
    },
    allow: {
      ...normalizeFlags(parentParams.allow),
      ...normalizeFlags(childParams.allow),
    },
    v8Flags: {
      ...normalizeFlags(parentParams.v8Flags),
      ...normalizeFlags(childParams.v8Flags),
    },
  };
}

function normalizeFlags(flags: string[] | FlagsObject | undefined) {
  if (Array.isArray(flags)) {
    return flags.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, {} as FlagsObject);
  }
  return flags;
}
