import { stringSimilarity } from "../deps.ts";
import { Scripts } from "./scripts_config.ts";

export function didYouMean(wrongName: string, scripts: Scripts): string | null {
  const names = Object.keys(scripts);
  const suggestion = names.reduce((closest: any, name, index) => {
    const similarity = stringSimilarity(wrongName, name);
    if (
      similarity > 0 &&
      (closest == null || similarity > (<any> closest).similarity)
    ) {
      return { index, similarity };
    }
    return closest;
  }, null);
  return suggestion ? names[suggestion.index] : null;
}
