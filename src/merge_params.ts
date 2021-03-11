import { FlagsObject, ScriptOptions } from "./scripts_config.ts";

export function mergeParams(
  childParams: ScriptOptions,
  parentParams: ScriptOptions,
): ScriptOptions {
  return {
    ...parentParams,
    ...childParams,
    env: {
      ...parentParams.env,
      ...childParams.env,
    },
    allow: {
      ...normalizeFlags(parentParams.allow as string[] | FlagsObject),
      ...normalizeFlags(childParams.allow as string[] | FlagsObject),
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
