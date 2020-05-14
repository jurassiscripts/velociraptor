# Velociraptor

An npm-style script runner for Deno

![Deno CI](https://github.com/umbopepato/velociraptor/workflows/Deno%20CI/badge.svg)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/velociraptor@v1.0.0-beta.3/src/scripts_config.ts#ScriptsConfiguration)

## Motivation

Mainly because Deno cli commands can easily become very long and difficult to remember. Also, npm scripts are cool 😎.  

## Install

```sh
$ deno install --allow-read --allow-env --allow-run -n vr https://deno.land/x/velociraptor/cli.ts
```

<details>
<summary>Upgrade</summary>

The above command will always install the latest version. If you're updating from an older version you might need to run the command with the `-f` flag.

</details>

<details>
<summary>Install a specific version</summary>

To install a specific version, run the install command with a specific version tag:

```sh
$ deno install ... https://deno.land/x/velociraptor@<version>/cli.ts
                                                    ^^^^^^^^^
```

For example

```sh
$ deno install --allow-read --allow-env --allow-run -n vr https://deno.land/x/velociraptor@v1.0.0-beta.3/cli.ts
```

</details>

## Usage

```sh
$ vr [SCRIPT OR OPTION] [ADDITIONAL ARGS]...
```

**`SCRIPT OR OPTION`**  
The identifier of the script to run or one of:

`-h, --help`     shows the help message,  
`-v, --version`  shows the version number.

**`ADDITIONAL ARGS`**  
Any other argument, passed to the script. Unlike `npm run`, the `--` separator is not needed.

Run `vr` without arguments to see a list of available scripts.

## Project status

👨‍💻 WIP: until Deno 1.0 is released there may be breaking changes. Will do my best to ensure compatibility with pre-1.0 releases anyway.

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

In this case the command(s) are specified in the `cmd` property. Use the `desc` property to provide a description of what the script does, it'll be shown in the list of available scripts (when running `vr` without arguments).

---

> 👇 The following properties can be specified both in script objects and at top-level, in which case they are applied to all the scripts defined in the file. Deno options are effectively only applied to `deno` commands that accept them.

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
    cmd: deno run --unstable server.ts
    imap: importmap.json
```

> 🧪 Import maps are currently marked as unstable so the `--unstable` flag must be provided.

### Inspect

`inspect` and `inspectBrk` correspond to the `--inspect` and `--inspect-brk` options.

```yaml
scripts:
  start:
    cmd: server.ts
    inspect: 127.0.0.1:9229
```

### Lockfile

The `lock` property sets the namesake deno option.

```yaml
scripts:
  start:
    cmd: server.ts
    lock: lock.json
```

> ⚠️ Setting this option doesn't create a lock file: you will have to create/update it by passing the `--lock-write` option manually to your script at the appropriate time. More info [here](https://deno.land/std/manual.md#lock-file).

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
  test: # Compound scripts can contain script objects as well
    - deno test test_one.ts
    - cmd: deno test test_two.ts
      tsconfig: tsconfig.json
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

Multiple commands specified in this way are executed separately. If you need to use pipes/redirections you can use your shell's syntax:

```yaml
scripts:
  start: cat file.ts | deno
```

### Script file model

See [ScriptConfiguration](https://doc.deno.land/https/deno.land/x/velociraptor@v1.0.0-beta.3/src/scripts_config.ts#ScriptsConfiguration) for a detailed description of the structure of script files.

## Shell scripting

Like in `npm` scripts, vr commands are executed inside a shell. The shell is determined by the `SHELL` env variable on Unix-like systems and by `ComSpec` on Windows, with respectively `sh` and `cmd.exe` as fallback values. To customize the shell without changing you default shell env variables you can use the `VR_SHELL` variable (a full path is requried).

The shell requirements are pretty much the same as [node's](https://nodejs.org/api/child_process.html#child_process_shell_requirements).

## Current working directory

Velociraptor searches for script files up the folder tree starting from the directory where the `vr` command was launched. Scripts are run from the directory where the script file is, independently of the initial location.

## Known limitations

Commands with quotes are currently unusable when the shell is `cmd.exe` due to the way Rust's `std::Command` (used by `Deno.run()`) escapes cli arguments (see [here](https://github.com/rust-lang/rust/issues/29494)).  
As a solution you can tell Velociraptor to use `PowerShell` instead of `cmd` (see [Shell scripting](#shell-scripting)) or run your scripts in the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/about).

## Contributing

Feedback and PRs are welcome! Just make sure to run `deno fmt` before committing ✨

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
