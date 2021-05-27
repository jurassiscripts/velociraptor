import { blue, existsSync, path } from "../deps.ts";
import { isScriptObject, makeFileExecutable, spawn } from "./util.ts";
import { version } from "./version.ts";
import { VR_HOOKS, VR_MARK } from "./consts.ts";
import { ConfigData } from "./load_config.ts";

export const hooks = [
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
  return `#!/bin/sh
# ${VR_MARK} ${version}
vr run-hook ${hook} "$@"
`;
}

function areGitHooksInstalled(gitDir: string): boolean {
  return existsSync(path.join(gitDir, "hooks", ".velociraptor"));
}

function installGitHooks(gitDir: string) {
  const hooksDir = path.join(gitDir, "hooks");
  hooks.forEach((hook) => {
    const hookFile = path.join(hooksDir, hook);
    if (existsSync(hookFile)) {
      Deno.renameSync(hookFile, `${hookFile}.bkp`);
    }
    Deno.writeTextFileSync(hookFile, hookScript(hook));
    makeFileExecutable(hookFile);
  });
  Deno.writeTextFileSync(path.join(hooksDir, ".velociraptor"), "");
  console.log(`
  ✅ ${blue("Git hooks successfully installed")}
  `);
}

export async function checkGitHooks(configData: ConfigData) {
  if (Deno.env.get(VR_HOOKS) === "false") return;
  try {
    const gitDir = await spawn(
      ["git", "rev-parse", "--git-common-dir"],
      configData.cwd,
    );
    const absGitDir = path.join(configData.cwd, gitDir.trim());
    if (
      !areGitHooksInstalled(absGitDir) &&
      Object.values(configData.config.scripts)
        .filter(isScriptObject)
        .some((s: any) => {
          return "gitHook" in s && hooks.includes(s.gitHook);
        })
    ) {
      installGitHooks(absGitDir);
    }
  } catch (e) {
    // Not a git repo
  }
}
