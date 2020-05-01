import stringSimilarity from "https://unpkg.com/string-similarity-js@2.1.2/src/string-similarity.ts";
import { Scripts } from "./types.ts";

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
