import { assertMatch, assertStringIncludes } from "./dev_deps.ts";
import { spawn } from "./src/util.ts";
const wd = "./test";
const cliArgs = [
  "deno",
  "run",
  "-qA",
  "../cli.ts",
];
const expectedOutput = "Works!";

async function runScript(name: string): Promise<string> {
  return spawn([...cliArgs, name], wd);
}

Deno.test("basic script with env variable", async () => {
  const output = await runScript("basic");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("deno run", async () => {
  const output = await runScript("denorun");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("compact deno run", async () => {
  const output = await runScript("compactrun");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("shell script", async () => {
  const output = await runScript("sh");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("serial scripts", async () => {
  const output = await runScript("multiple");
  assertMatch(output, /one[\r\n]+two[\r\n]*/);
});

Deno.test("parallel scripts", async () => {
  const output = await runScript("multiplepll");
  assertMatch(output, /two[\r\n]+one[\r\n]*/);
});

Deno.test("deno permissions", async () => {
  const output = await runScript("allow");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("tsconfig", async () => {
  const output = await runScript("tsconfig");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("importmap", async () => {
  const output = await runScript("importmap");
  assertStringIncludes(output, expectedOutput);
});

Deno.test("--help", async () => {
  const output = await runScript("--help");
  assertStringIncludes(output, "--version");
});
