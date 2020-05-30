import { levenshtein } from "../deps.ts";
import { Scripts } from "./scripts_config.ts";

export function didYouMean(wrongName: string, scripts: Scripts): string | null {
  const names = Object.keys(scripts);
  const suggestion = names.reduce((closest: any, name, index) => {
    const distance = levenshtein(wrongName, name);
    if (
      distance < wrongName.length &&
      (closest == null || distance < (<any> closest).distance)
    ) {
      return { index, distance };
    }
    return closest;
  }, null);
  return suggestion ? names[suggestion.index] : null;
}
