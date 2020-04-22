import { ScriptParameters, FlagsObject } from "./types.ts";

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
  parentParams: ScriptParameters,
  childParams: ScriptParameters,
): ScriptParameters => {
  const env = { ...parentParams.env, ...childParams.env };
  const allow = {
    ...normalizeFlags(parentParams.allow),
    ...normalizeFlags(childParams.allow),
  };
  const v8flags = {
    ...normalizeFlags(parentParams.v8flags),
    ...normalizeFlags(childParams.v8flags),
  };
  let res: ScriptParameters = { ...parentParams, ...childParams };
  if (env) res.env = env;
  if (allow) res.allow = allow;
  if (v8flags) res.v8flags = v8flags;
  return res;
};
