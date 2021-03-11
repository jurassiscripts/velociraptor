import { levenshtein } from "../deps.ts";

export function didYouMean(wrongStr: string, strings: string[]): string | null {
  const suggestion = strings.reduce((closest: any, name, index) => {
    const distance = levenshtein(wrongStr, name);
    if (
      distance < wrongStr.length &&
      (closest == null || distance < (<any> closest).distance)
    ) {
      return { index, distance };
    }
    return closest;
  }, null);
  return suggestion ? strings[suggestion.index] : null;
}
