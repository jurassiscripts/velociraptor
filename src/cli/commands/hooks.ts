import { BaseCommand } from "../../../deps.ts";
import { ConfigData } from "../../load_config.ts";
import { runScript } from "../../run_script.ts";
import { HookType } from "../types/hook_type.ts";
import {installGitHooks} from '../../git_hooks.ts';

export class HooksCommand extends BaseCommand {
  constructor(private configData: ConfigData | null) {
    super();
    this.description("Git hooks")
      .type("hook", new HookType())
      .command("run <hook:hook> [args...]")
      .description("Run a git hook")
      .useRawArgs()
      .action(async (_, hook: string, ...args: string[]) => {
        await runHook(this.configData, hook, args);
      })
      .command("install")
      .description("Install git hooks")
      .action(() => installGitHooks(this.configData.cwd));
  }
}
