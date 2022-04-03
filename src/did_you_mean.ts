import { levenshtein } from "../deps.ts";

export function didYouMean(wrongStr: string, strings: string[]): string | null {
  const suggestion = strings.reduce((closest: unknown, name, index) => {
    const distance = levenshtein(wrongStr, name);
    if (
      distance < wrongStr.length &&
      (closest == null ||
        distance < (<{ index: number; distance: number }> closest).distance)
    ) {
      return { index, distance };
    }
    return closest;
  }, null);
  return suggestion
    ? strings[(<{ index: number; distance: number }> suggestion).index]
    : null;
}
