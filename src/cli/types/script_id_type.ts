import { StringType } from "../../../deps.ts";
import { ConfigData } from "../../load_config.ts";

export class ScriptIdType extends StringType {
  constructor(private configData: ConfigData | null) {
    super();
  }

  complete(): string[] {
    if (!this.configData || !this.configData.config?.scripts) return [];
    return Object.keys(this.configData.config.scripts);
  }
}
