
## [1.0.0-beta.15](https://github.com/umbopepato/velociraptor/compare/1.0.0-beta.14...1.0.0-beta.15) (2020-10-23)


### Features

* **cli:** add fish completions support ([b9729b9](https://github.com/umbopepato/velociraptor/commit/b9729b94b7e306172b2b11a2c3a95931e0b074a5)) [@kidonng](https://github.com/kidonng)

## [1.0.0-beta.14](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.13...1.0.0-beta.14) (2020-09-24)


### Features

* **cli:** add bash completions support ([84a7214](https://github.com/umbopepato/velociraptor/commit/84a72147df35ada2e4d9457123d4102663644a8b))
* **config:** add new Deno cli options ([9dcff3e](https://github.com/umbopepato/velociraptor/commit/9dcff3e4f9c3f7b52d1f4ef71ca7a50d68c3ab4d))

## [1.0.0-beta.13](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2020-07-15)


### Bug Fixes

* std errors with deno 1.2.0 ([848999a](https://github.com/umbopepato/velociraptor/commit/848999a4136ca3f68101b1e0025c11a6818d1dba))

## [1.0.0-beta.12](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2020-06-30)


### Revert

* feat(export): execute exported scripts in the correct workdir ([ec6c502](https://github.com/umbopepato/velociraptor/commit/ec6c502a2b5016cae038374bc46420a54e3d2e1f))

## [1.0.0-beta.11](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2020-06-09)


### Features

* add support for `.ts` config files ([df27540](https://github.com/umbopepato/velociraptor/commit/df275400bb0e5fb232f5fbc72237f679006a032a))

### Bug Fixes

* **cli:** default help option not working ([4a88bfa](https://github.com/umbopepato/velociraptor/commit/4a88bfa299cfdf535e2e9cafdb4ea1c47ff7beda)), closes [#32](https://github.com/umbopepato/velociraptor/issues/32)
* **config:** use the file:// protocol to import ts config files ([e82be9c](https://github.com/umbopepato/velociraptor/commit/e82be9ca12eaa35aa3a7f3967ed094f11312d607))
* **export:** execute exported scripts in the correct workdir ([446962f](https://github.com/umbopepato/velociraptor/commit/446962f612b168bdfdd0a3eb87a3941a37ce96c0))

## [1.0.0-beta.10](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2020-06-05)


### Features

* **run:** add .js support to compact run ([4226144](https://github.com/umbopepato/velociraptor/commit/422614461d9537303fb9edc7b6ab5b0fdf3e8c2f))


### Bug Fixes

* **export:** absolute outDir treated as relative ([e6b8570](https://github.com/umbopepato/velociraptor/commit/e6b85700dc9fe552a59fa1201752ef3465c989b0))

## [1.0.0-beta.9](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2020-05-29)


### Bug Fixes

* quoted arguments with spaces are split ([c00c866](https://github.com/umbopepato/velociraptor/commit/c00c8661bb684cf491899a4149e043083a66ef8f)), closes [#28](https://github.com/umbopepato/velociraptor/issues/28)

## [1.0.0-beta.8](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2020-05-25)


### Bug Fixes

* **cli:** version flag not working ([2698141](https://github.com/umbopepato/velociraptor/commit/2698141699ab1f1cd1a0d4b4fb50354d60d22d2c))

## [1.0.0-beta.7](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2020-05-25)


### Features

* **export:** add script exporting functionality ([399d5e3](https://github.com/umbopepato/velociraptor/commit/399d5e3d101df95bf35d71e2ab9542bff004fe3f))


### Bug Fixes

* **cli:** flags in additionalArgs consumed by vr ([9510a92](https://github.com/umbopepato/velociraptor/commit/9510a92cc07f3ae69d3ffa8fc696ff6bcaf8c36c)), closes [#26](https://github.com/umbopepato/velociraptor/issues/26)
* **script-config:** add ParallelScripts to CompositeScript ([bb3d7bf](https://github.com/umbopepato/velociraptor/commit/bb3d7bfc7b826839a1eda9f4d046c4c736078d60))
* correct validation functions imports ([454cb75](https://github.com/umbopepato/velociraptor/commit/454cb756fe1026daa06e72ed77a6582d1b82daad))

## [1.0.0-beta.6](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2020-05-22)


### Features

* **export:** add script exporting functionality ([81e457f](https://github.com/umbopepato/velociraptor/commit/81e457febb2d8156fa3a752928bdb9af146bc6b6))

## [1.0.0-beta.5](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2020-05-17)


### Bug Fixes

* **script-normalization:** wrong mergeParams argument order ([0c54801](https://github.com/umbopepato/velociraptor/commit/0c54801e1eb73e7f22e46cc5052e4fe09de0156c))

## [1.0.0-beta.4](https://github.com/umbopepato/velociraptor/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2020-05-16)


### Code Refactoring

* **cli:** add cliffy ([82a142d](https://github.com/umbopepato/velociraptor/commit/82a142d761308a9e0db3988d3c2f012f06069652))


### Features

* add support for loading velociraptor.{ext} files ([d5e5f70](https://github.com/umbopepato/velociraptor/commit/d5e5f701648aa31976b13819673bd76302b10fb7))


### BREAKING CHANGES

* **cli:** vr subcommands (ie 'run', 'help'...) have been introduced
and can collide with equal script names.
Use the 'run' command to avoid colliding with the cli.
