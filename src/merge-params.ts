import { ScriptOptions, FlagsObject } from "./types.ts";

const normalizeFlags = (flags: string[] | FlagsObject | undefined) => {
  if (Array.isArray(flags)) {
    return flags.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, {} as FlagsObject);
  }
  return flags;
};

export const mergeParams = (
  parentParams: ScriptOptions,
  childParams: ScriptOptions,
): ScriptOptions => ({
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
  v8flags: {
    ...normalizeFlags(parentParams.v8flags),
    ...normalizeFlags(childParams.v8flags),
  },
});
