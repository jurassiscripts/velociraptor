import { Command, ParallelCommands } from "./normalize-script.ts";

export const runCommands = (commands: Array<Command | ParallelCommands | null>) => {
  if (!commands) return;
  
  console.log(Deno.inspect(commands, {depth: Infinity}));
};
