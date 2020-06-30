import { StringType } from "../../../deps.ts";
import { hooks } from "../../git_hooks.ts";

export class HookType extends StringType {
  complete(): string[] {
    return hooks;
  }
}
