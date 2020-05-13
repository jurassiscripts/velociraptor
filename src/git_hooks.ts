import {
  writeFileStrSync,
  existsSync,
  path,
} from "../deps.ts";
import {
  ScriptsConfiguration,
  isScriptObject,
} from "./scripts_config.ts";

const hooks = [
  "applypatch-msg",
  "pre-applypatch",
  "post-applypatch",
  "pre-commit",
  "pre-merge-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "post-update",
  "push-to-checkout",
  "pre-auto-gc",
  "post-rewrite",
  "sendemail-validate",
];

function hookScript(hook: string): string {
  return `!/bin/sh
vr --git-hook=${hook} "$@"
`;
}

function areGitHooksInstalled(cwd: string): boolean {
  return existsSync(path.join(cwd, ".git", "hooks", ".velociraptor"));
}

function installGitHooks(cwd: string) {
  const hooksFolder = path.join(cwd, ".git", "hooks");
  hooks.forEach((hook) => {
    const hookFile = path.join(hooksFolder, hook);
    writeFileStrSync(hookFile, hookScript(hook));
    try {
      Deno.chmodSync(hookFile, 0o0755);
    } catch (e) {
      // silently fail
    }
  });
  writeFileStrSync(path.join(hooksFolder, ".velociraptor"), "");
}

export function checkGitHooks(config: ScriptsConfiguration, cwd: string) {
  if (
    !areGitHooksInstalled(cwd) &&
    Object.values(config.scripts)
      .filter((s) => s instanceof Object && isScriptObject(s)) // TODO move instanceof in isScriptObject
      .some((s: any) => {
        return "githook" in s && hooks.includes(s.githook);
      })
  ) {
    installGitHooks(cwd);
  }
}
