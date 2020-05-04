import { assert, assertEquals } from "./dev_deps.ts";
const wd = "./test";
const cliArgs = [
  "deno",
  "run",
  "--allow-read",
  "--allow-run",
  "--allow-env",
  "../cli.ts",
];
const expectedOutput = "Works!\n";

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
  assert(new RegExp(`${expectedOutput}\n*`).test(output));
});

Deno.test("deno run", async () => {
  const output = await runScript("run");
  assertEquals(output, expectedOutput);
});

Deno.test("compact deno run", async () => {
  const output = await runScript("compactrun");
  assertEquals(output, expectedOutput);
});

Deno.test("shell script", async () => {
  const output = await runScript("sh");
  assert(output.includes(expectedOutput));
});

Deno.test("serial scripts", async () => {
  const output = await runScript("multiple");
  assert(/one\n+two\n*/.test(output));
});

Deno.test("parallel scripts", async () => {
  const output = await runScript("multiplepll");
  assert(/two\n+one\n*/.test(output));
});

Deno.test("deno permissions", async () => {
  const output = await runScript("allow");
  assertEquals(output, expectedOutput);
});

Deno.test("tsconfig", async () => {
  const output = await runScript("tsconfig");
  assertEquals(output, expectedOutput);
});

Deno.test("importmap", async () => {
  const output = await runScript("importmap");
  assertEquals(output, expectedOutput);
});
