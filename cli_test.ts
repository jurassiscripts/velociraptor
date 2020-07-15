import { assertStringContains, assertMatch } from "./dev_deps.ts";
const wd = "./test";
const cliArgs = [
  "deno",
  "run",
  "-qA",
  "../cli.ts",
];
const expectedOutput = "Works!";

async function runScript(name: string): Promise<string> {
  const process = Deno.run({
    cmd: [...cliArgs, name],
    cwd: wd,
    stdout: "piped",
  });
  const { code } = await process.status();
  if (code === 0) {
    const rawOutput = await process.output();
    process.close();
    return new TextDecoder().decode(rawOutput);
  } else {
    process.close();
    throw new Error(`Process exited with error code ${code}`);
  }
}

Deno.test("basic script with env variable", async () => {
  const output = await runScript("basic");
  assertStringContains(output, expectedOutput);
});

Deno.test("deno run", async () => {
  const output = await runScript("denorun");
  assertStringContains(output, expectedOutput);
});

Deno.test("compact deno run", async () => {
  const output = await runScript("compactrun");
  assertStringContains(output, expectedOutput);
});

Deno.test("shell script", async () => {
  const output = await runScript("sh");
  assertStringContains(output, expectedOutput);
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
  assertStringContains(output, expectedOutput);
});

Deno.test("tsconfig", async () => {
  const output = await runScript("tsconfig");
  assertStringContains(output, expectedOutput);
});

Deno.test("importmap", async () => {
  const output = await runScript("importmap");
  assertStringContains(output, expectedOutput);
});

Deno.test("--help", async () => {
  const output = await runScript("--help");
  assertStringContains(output, "--version");
});
