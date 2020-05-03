export { stringSimilarity } from "https://unpkg.com/string-similarity-js@2.1.2/src/string-similarity.ts";
export { parse as parseYaml } from "https://deno.land/std@0.42.0/encoding/yaml.ts";
export {
  readJsonSync,
  readFileStrSync,
  existsSync,
} from "https://deno.land/std@0.42.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.42.0/path/mod.ts";
export * as logger from "https://deno.land/std@0.42.0/log/mod.ts";
export {
  blue,
  yellow,
  red,
  bold,
  gray,
} from "https://deno.land/std@0.42.0/fmt/colors.ts";
export { ConsoleHandler } from "https://deno.land/std@0.42.0/log/handlers.ts";
export { LogRecord } from "https://deno.land/std@0.42.0/log/logger.ts";
export { isWindows } from "https://deno.land/std@0.42.0/path/constants.ts";
