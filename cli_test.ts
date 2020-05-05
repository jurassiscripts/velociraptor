import { assertStrContains, assertMatch } from "./dev_deps.ts";
const wd = "./test";
const cliArgs = [
  "deno",
  "run",
  "--allow-read",
  "--allow-run",
  "--allow-env",
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
  assertStrContains(output, expectedOutput);
});

Deno.test("deno run", async () => {
  const output = await runScript("run");
  assertStrContains(output, expectedOutput);
});

Deno.test("compact deno run", async () => {
  const output = await runScript("compactrun");
  assertStrContains(output, expectedOutput);
});

Deno.test("shell script", async () => {
  const output = await runScript("sh");
  assertStrContains(output, expectedOutput);
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
  assertStrContains(output, expectedOutput);
});

Deno.test("tsconfig", async () => {
  const output = await runScript("tsconfig");
  assertStrContains(output, expectedOutput);
});

Deno.test("importmap", async () => {
  const output = await runScript("importmap");
  assertStrContains(output, expectedOutput);
});
