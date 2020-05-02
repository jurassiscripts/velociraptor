# Velociraptor

The `npm run` for Deno 

## Motivation

Mainly because `deno` commands can easily become very long and difficult to remember. Also, `npm` scripts are cool.

## Install

To install this module as an executable run

```sh
$ deno install vr --allow-read --allow-env --allow-run https://raw.github.com/umbopepato/velociraptor/master/mod.ts
```

## Usage

```sh
$ vr [SCRIPT NAME] [ADDITIONAL ARGS]...
```

**`SCRIPT NAME`**  
The identifier of the script to run.

**`ADDITIONAL ARGS`**  
Any other argument, passed to the script.

Run `vr` without arguments to see a list of available scripts.

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

### Basic scripts

In its simplest form, the `scripts` property behaves like in package.json: the keys are script names and the values are the command strings.

### Compact deno run

When a command starts with a `.ts` file, `deno run` is automatically prepended:

```yaml
scripts:
  start: server.ts # Equivalent to `deno run server.ts`
```

### More script options

Scripts can also be objects:

```yaml
scripts:
  start:
    desc: Runs the server
    cmd: deno run --allow-net server.ts
```

In this case the command(s) are specified in the `cwd` property. A description can be provided in the `desc` property.

---

> 👇 The following properties can be specified both in script objects and at top-level, in which case they refer to all the scripts defined in the file.

---

### Environment variables

Environment variables can be specified in the `env` mapping.

```yaml
# Env vars specified here are sent to
# all the scripts
env:
  PORT: 8081

scripts:
  start:
    cmd: deno run --allow-net server.ts
    env: # and these are script-specific
      PORT: 8082
```

### Permissions

Deno [permissions](https://deno.land/std/manual.md#goals) can be specified using `allow`.

```yaml
# `allow` can be a list of boolean flags
allow:
  - net
  - read

scripts:
  start:
    cmd: server.ts
    allow: # or a map
      net: 127.0.0.1
```

### Tsconfig

To specify a `tsconfig`, set the `tsconfig` property.

```yaml
scripts:
  start:
    cmd: server.ts
    tsconfig: tsconfig.json
```

### Import maps

Import maps are speficied in `imap`.

```yaml
scripts:
  start:
    cmd: server.ts
    imap: importmap.json
```

### Inspect

`inspect` and `inspectBrk` correspond to the `--inspect` and `--inspect-brk` options.

```yaml
scripts:
  start:
    cmd: server.ts
    inspect: 127.0.0.1:9229
```

### Lock

The `lock` property sets the namesake deno option.

```yaml
scripts:
  start:
    cmd: server.ts
    lock: lock.json
```

> ⚠️ Setting this option doesn't create a lock file: you will have to create/update it by passing the `--create-lock` option manually to your script at the appropriate time. More info [here](https://deno.land/std/manual.md#lock-file).

### Log

The `log` property corresponds to deno's `--log-level`. The allowed values are `debug` and `info`.

```yaml
scripts:
  start:
    cmd: server.ts
    log: debug
```

### Cert

Specify a PEM certificate for http client in `cert`.

```yaml
scripts:
  start:
    cmd: server.ts
    cert: certificate.pem
```

### V8 flags

[V8 flags](https://deno.land/std/manual.md#v8-flags) can be specified like permissions under the `v8Flags` property.

```yaml
v8Flags:
  - expose-gc
  - async-stack-trace

scripts:
  start:
    cmd: server.ts
    v8Flags:
      logfile: v8.log
```

### Multiple commands

If the script value is an array of commands, the commands are executed serially.

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

Multiple commands specified in this way are executed separately. If you need to use pipes/redirections use your shell syntax:

```yaml
scripts:
  start: deno run file.ts | echo
```

### Script file model

See the [ts docs]() of the model behind script configurations for a precise description of script files.

## Shell scripting

Like in `npm` scripts, vr commands are executed inside a shell. The shell is determined by the `SHELL` env variable on Unix-like systems and by `ComSpec` on Windows with `/bin/bash` and `cmd.exe` as fallback values.

The shell requirements are pretty much the same as [node's](https://nodejs.org/api/child_process.html#child_process_shell_requirements).

## Current working directory

Velociraptor searches for script files up the folder tree starting from the `cwd` where it was launched. Independently of the initial location, scripts are run from the directory where the script file is.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for details.
