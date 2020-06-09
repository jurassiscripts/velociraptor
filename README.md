<p align="center">
  <img src="assets/logo.svg" width="350">
</p>

<p align="center">
  Velociraptor is a script runner for Deno, inspired by npm's package.json scripts. It offers a similar experience but with out-of-the-box support for declarative deno cli options, environment variables, concurrency and (soon) git hooks.
</p>

<p align="center">

 <img alt="CI" src="https://github.com/umbopepato/velociraptor/workflows/Deno%20CI/badge.svg"/>
 <img alt="Version" src="https://img.shields.io/github/v/release/umbopepato/velociraptor?logo=github&include_prereleases">
 <a href="https://github.com/umbopepato/velociraptor"><img alt="GitHub stars" src="https://img.shields.io/github/stars/umbopepato/velociraptor?logo=github"></a>
 <a href="#badge"><img alt="vr scripts" src="https://badges.velociraptor.run/flat.svg"/></a>
 <a href="https://doc.deno.land/https/deno.land/x/velociraptor@v1.0.0-beta.10/src/scripts_config.ts#ScriptsConfiguration"><img src="https://img.shields.io/badge/deno-doc-blue?logo=deno"></a>
 <a href="https://deno.land"><img src="https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno"/></a>
 <a href="https://discord.gg/M5K7TBd"><img src="https://img.shields.io/badge/join-chat-7289DA?logo=discord&logoColor=white"/></a>
 <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen"/></a>

</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Motivation](#motivation)
- [Install](#install)
- [Project status](#project-status)
- [Script files](#script-files)
- [Listing scripts](#listing-scripts)
- [Running scripts](#running-scripts)
- [Exporting scripts](#exporting-scripts)
- [Shell scripting](#shell-scripting)
- [Current working directory](#current-working-directory)
- [Shell completions](#shell-completions)
- [Editor support](#editor-support)
- [Help](#help)
- [Badge](#badge)
- [Known limitations](#known-limitations)
- [Upcoming features](#upcoming-features)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Motivation

One of the things that many developers find disorientating about Deno is the fact that it [doesn't have](https://deno.land/manual#philosophy) an external package manager like npm. On one side this new paradigm simplifies many aspects of development; on the other, the lack of some npm features - notably scripts - can be really limiting: Deno cli commands can become _very_ long and difficult to track without a place to store them and there's not an easy way to share workflow scripts, git hooks and external tooling with contributors. Velociraptor tries to provide a relatively lightweight solution to this problems by expanding the concept of npm scripts.

## Install

```sh
$ deno install -qA -n vr https://deno.land/x/velociraptor@v1.0.0-beta.10/cli.ts
```

To get help with the CLI run `vr help`, or `vr help <SUBCOMMAND>` for specific commands.

## Project status

👨‍💻 WIP: until the Deno std library is stable there may be breaking changes here, use carefully and feel free to open an issue if you find a bug.

## Script files

To get started, create a file called `scripts.yaml` or `velociraptor.yaml` in your project folder:

```yaml
# scripts.yaml
scripts:
  start: deno run --allow-net server.ts
  test: deno test --allow-net server_test.ts
```

`.json` and `.ts` config files are supported as well:

```json
// scripts.json
{
  "scripts": {
    "start": "deno run --allow-net server.ts",
    "test": "deno test --allow-net server_test.ts"
  }
}
```

```ts
// scripts.ts
export default {
  scripts: {
    start: "deno run --allow-net server.ts",
    test: "deno test --allow-net server_test.ts",
  },
};
```

### Basic scripts

In its simplest form, the `scripts` property behaves like in package.json: the keys are script names and the values are the command strings.

### Compact deno run

When a command starts with a `.ts` or `.js` file, `deno run` is automatically prepended:

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

Deno [permissions](https://deno.land/manual/getting_started/permissions) can be specified using `allow`.

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

Import maps are specified in `imap`.

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

> ⚠️ Setting this option doesn't create a lock file: you will have to create/update it by passing the `--lock-write` option manually to your script at the appropriate time. More info [here](https://deno.land/manual/linking_to_external_code/integrity_checking).

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

V8 flags can be specified like permissions under the `v8Flags` property.

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

### Compound commands and concurrency

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

To declare concurrent commands, list them in the `pll` property of an object.

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

See [ScriptConfiguration](https://doc.deno.land/https/deno.land/x/velociraptor@v1.0.0-beta.10/src/scripts_config.ts#ScriptsConfiguration) for a detailed description of the structure of script files.

## Listing scripts

Run

```sh
$ vr
```

to see a list of available scripts.

## Running scripts

To run a script, use the `run` subcommand

```sh
$ vr run <SCRIPT> [ADDITIONAL ARGS]...
```

or, more concisely

```sh
$ vr [SCRIPT] [ADDITIONAL ARGS]...
```

|Arg or option|Description|
|:---|:---|
|`SCRIPT`|The identifier of the script to run.|
|`ADDITIONAL ARGS`|Any other argument, passed to the script. Unlike `npm run`, the `--` separator is not needed.|

For example, run

```sh
$ vr start
# or
$ vr run start
```

to execute the `start` script.

> If you enabled [shell completions](#shell-completions), trigger the autocomplete on one of this commands to get the available scripts as suggestions.

## Exporting scripts

You may find yourself in a situation where you want to use velociraptor to manage your scripts during development, but you're not comfortable installing it (or just can't install it) in your production environment.
In this case the `export` subcommand may be of help: it allows you to export one or more scripts as standalone executable shell files:

```sh
$ vr export [SCRIPTS]...
```

|Arg or option|Description|
|:---|:---|
|`SCRIPTS`|A space-separated list of scripts to export. If omitted, all the declared scripts are exported.|
|`-o, --out-dir`|The directory where the scripts will be exported (default: `bin`).|

For example, run

```sh
$ vr export start
```

to export the `start` script, together with its env variables, deno cli options etc. Now you can execute it by running

```sh
$ ./bin/start [ARGS]...
```

> Scripts exporting currently only supports `sh`.

## Shell scripting

Like in `npm` scripts, vr commands are executed inside a shell. The shell is determined by the `SHELL` env variable on Unix-like systems and by `ComSpec` on Windows, with respectively `sh` and `cmd.exe` as fallback values. To customize the shell without changing your default shell env variables you can use the `VR_SHELL` variable (a full path is required).

The shell requirements are pretty much the same as [node's](https://nodejs.org/api/child_process.html#child_process_shell_requirements).

## Current working directory

Velociraptor searches for script files up the folder tree starting from the directory where the `vr` command was launched. Scripts are run from the directory where the script file is, independently of the initial location.

## Shell completions

To enable zsh tab-completion for velociraptor commands, add the following line to your `~/.zshrc`

```sh
source <(vr completions zsh)
```

> Bash is not supported yet, but will be added.

## Editor support

#### VSCode

[Velociraptor support for VSCode](https://marketplace.visualstudio.com/items?itemName=umbo.vscode-velociraptor) adds code assistance for script configuration files (both `yaml` and `json`).

## Help

If you need any help feel free to ask in the [chat](https://discord.gg/M5K7TBd) or on [StackOverflow](https://stackoverflow.com/questions/tagged/velociraptor) using the `velociraptor` tag. 

## Badge

Show your collaborators/users you use velociraptor:

```markdown
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
```

[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)

## Known limitations

Commands with quotes are currently unusable when the shell is `cmd.exe` due to the way Rust's `std::Command` (used by `Deno.run()`) escapes cli arguments (see [here](https://github.com/rust-lang/rust/issues/29494)).  
As a workaround you can tell Velociraptor to use `PowerShell` instead of `cmd` (see [Shell scripting](#shell-scripting)) or run your scripts in the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/about).

## Upcoming features

- [ ] Self-update: run `vr upgrade` to install the latest version.
- [ ] Husky style git hooks: use the `hook` property to link a script to a git hook.

## Contributing

Feedback and PRs are welcome! Take a look at the [contributing guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
