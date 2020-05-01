import * as logger from "https://deno.land/std/log/mod.ts";
import { blue, yellow, red, bold } from "https://deno.land/std/fmt/colors.ts";
import { ConsoleHandler } from "https://deno.land/std/log/handlers.ts";
import { LogRecord } from "https://deno.land/std/log/logger.ts";

const LEVEL_PREFIX: { [key: number]: string } = {
  [logger.LogLevels.INFO]: blue("info"),
  [logger.LogLevels.WARNING]: yellow("warn"),
  [logger.LogLevels.ERROR]: red("error"),
  [logger.LogLevels.CRITICAL]: bold(red("critical")),
};

await logger.setup({
  handlers: {
    console: new class extends ConsoleHandler {
      format(logRecord: LogRecord) {
        return `${LEVEL_PREFIX[logRecord.level]}: ${logRecord.msg}`;
      }
    }("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const log = logger.getLogger();
