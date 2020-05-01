# Velociraptor

A Deno alternative to package.json scripts

## Install

To install this module as an executable run

```sh
$ deno install vr --allow-run --allow-env --allow-run https://raw.github.com/umbopepato/velociraptor/master/mod.ts
```

## Usage

```sh
$ vr [script name] [additional args]...
```

**`script name`**  
The identifier of the script to run.

**`additional args`**  
Any other arguments, passed to the script.

Run `vr` without arguments to see a list of the available scripts.

## Script files

To define scripts, create a file called `scripts.yaml` or `scripts.json` in your project folder.

```yaml
# scripts.yaml
scripts:
  start: deno run --allow-net server.ts
  test: deno test --allow-net server_test.ts
```

or

```json
// scripts.json
{
  "scripts": {
    "start": "deno run --allow-net server.ts",
    "test": "deno test --allow-net server_test.ts"
  }
}
```

### Scripts

#### Basic

In its simplest form, the `scripts` property behaves like in package.json: the keys are script names and the values are the command strings.

#### Compact deno run

When a command starts with a `.ts` file, `deno run` is prepended:

```yaml
scripts:
  start: server.ts # Equivalent to `deno run server.ts`
```

#### Multiple commands

If the script value is an array of commands, the commands are executed serially. **Pipes!!!!!**

```yaml
scripts:
  start:
    - deno run one.ts
    - deno run two.ts
```

To execute commands in parallel, list them in the `pll` property of an object.

```yaml
scripts:
  start:
    pll:
      - deno run one.ts
      - deno run two.ts
```

Parallel and serial scripts can be combined as well.

```yaml
scripts:
  start:
    - pll:
        - deno run one.ts
        - deno run two.ts
    - deno run three.ts
```

#### More script options

Scripts can also be objects:

```yaml
scripts:
  start:
    desc: Runs the server
    cmd: deno run --allow-net server.ts
```

In this case the command(s) are specified in the `cwd` property. A description can be provided in the `desc` property.

> The following properties can be specified both in script objects and globally, in which case they refer to all scripts defined in the file.

#### Environment variables

Environment variables can be specified in the `env` mapping.

```yaml
# Env vars specified here are sent to
# all the scripts
env:
  PORT: 8081

scripts:
  start:
    desc: Starts the server
    cmd: deno run --allow-net server.ts
    env: # And can be overridden here
      PORT: 8082
```

#### Permissions

Deno [permissions](https://deno.land/std/manual.md#goals) can be specified using the `allow` key.

```yaml
# `allow` can be a list of boolean flags
allow:
  - net
  - read

scripts:
  start:
    desc: Starts the server
    cmd: deno run server.ts
    allow: # or a map
      net: 127.0.0.1
```

#### V8 flags

[V8 flags](https://deno.land/std/manual.md#v8-flags) can be specified like permissions under the `v8flags` key.

```yaml
# `allow` can be a list of boolean flags
v8flags:
  - expose-gc
  - async-stack-trace

scripts:
  start:
    desc: Starts the server
    cmd: deno run server.ts
    v8flags:
      logfile: v8.log
```

#### Shell scripting



## Velociraptor executable permissions

