
## [1.4.0](https://github.com/jurassiscripts/velociraptor/compare/1.3.0...1.4.0) (2022-01-17)


### Features

* 🚚 rename `imap` option to `importmap` ([ac6a2a5](https://github.com/jurassiscripts/velociraptor/commit/ac6a2a59528a1f3b196a1658e7618200d1a60ed2))
* add `.js` and `.mjs` support to loader ([cc03e3b](https://github.com/jurassiscripts/velociraptor/commit/cc03e3b0078f4b89667afa9b26b28f4178494731))
* add watch option to bundle, fmt and lint commands ([4e76fc0](https://github.com/jurassiscripts/velociraptor/commit/4e76fc0b4da7f4caa9efc6aad88c47692c92fbd0))
* support deno.json config file ([a4e1101](https://github.com/jurassiscripts/velociraptor/commit/a4e1101f51288c615eadb473f62ec5e0062bda6c))


### Bug Fixes

* 🏷️ add deprecated `imap` to options type ([6ad120e](https://github.com/jurassiscripts/velociraptor/commit/6ad120e2b3d7c69fa09a38ee989a6782d6fb7373))
* 🗑️ add `imap` back with a deprecation notice ([8c3beb0](https://github.com/jurassiscripts/velociraptor/commit/8c3beb0d049f4570ee55f7fd7c473df735ff273b))
* 🚚 rename imap.ts to importmap.ts ([f3f841a](https://github.com/jurassiscripts/velociraptor/commit/f3f841a1141070ad056e63ec0609c40436371769))
* commit with correct format for commitlint ([d857c7c](https://github.com/jurassiscripts/velociraptor/commit/d857c7c34138ccadd283fd0cd93b22204308d76c))
* commitlint script ([b198bb2](https://github.com/jurassiscripts/velociraptor/commit/b198bb2ce9497e0f87f72155b08064f895a1e49d))
* rename wrong script name ([6edba1c](https://github.com/jurassiscripts/velociraptor/commit/6edba1c3cfec0116382e0a4ffdd486739216d852))

## [1.3.0](https://github.com/jurassiscripts/velociraptor/compare/1.2.0...1.3.0) (2021-11-02)


### Features

* **hooks:** change script prefix to works on windows ([b076cca](https://github.com/jurassiscripts/velociraptor/commit/b076cca67787e68fd1049b14d3692e8da8371654))
* **hooks:** create multishell prefix ([2e6ab58](https://github.com/jurassiscripts/velociraptor/commit/2e6ab5887b77607d3be44b1d4780e5c6a17ce3dd))


### Bug Fixes

* **hooks:** first argument missing from GIT_ARGS ([5ecea0e](https://github.com/jurassiscripts/velociraptor/commit/5ecea0e7d73c814bf6709e261da4136facc4f54c)), closes [#82](https://github.com/jurassiscripts/velociraptor/issues/82)

## [1.2.0](https://github.com/jurassiscripts/velociraptor/compare/1.1.0...1.2.0) (2021-08-31)


### Features

* support desc field for parallel scripts ([142482f](https://github.com/jurassiscripts/velociraptor/commit/142482f0b8c687a0ec296dd862eca47e9e2d59dd))
* support for Deno v1.13.x ([00fd1b1](https://github.com/jurassiscripts/velociraptor/commit/00fd1b1744c25fd9cc44ce43593d5926f05797b6))

## [1.1.0](https://github.com/jurassiscripts/velociraptor/compare/1.0.2...1.1.0) (2021-08-06)


### Features

* **script:** combined descriptions for composite scripts ([cf17689](https://github.com/jurassiscripts/velociraptor/commit/cf17689a6ef99dd903c5cc8c6af8ee52237e858f))

### [1.0.2](https://github.com/jurassiscripts/velociraptor/compare/1.0.1...1.0.2) (2021-07-19)


### Bug Fixes

* don't normalize additional arguments in vr command ([07505e2](https://github.com/jurassiscripts/velociraptor/commit/07505e2f9e396040f78c2c564b0a569bb23859e7))

### [1.0.1](https://github.com/jurassiscripts/velociraptor/compare/1.0.0...1.0.1) (2021-06-14)

## [1.0.0](https://github.com/jurassiscripts/velociraptor/compare/1.0.0-beta.18...1.0.0) (2021-05-27)


### ⚠ BREAKING CHANGES

* **run:** use PowerShell by default on Windows

### Features

* **cli:** add git hook to script info output ([dba1ba6](https://github.com/jurassiscripts/velociraptor/commit/dba1ba64e76535c06fe26cda6827870898f7f939))
* **cli:** add hooks command ([561a4fd](https://github.com/jurassiscripts/velociraptor/commit/561a4fd05fba8bc619386b6382d392eb0d65a292))
* **cli:** add run-hook command ([66f127f](https://github.com/jurassiscripts/velociraptor/commit/66f127f83a847235ce8c97f6c82ae7145a8d2254))
* **cli:** add upgrade command and update notifier ([8bcf024](https://github.com/jurassiscripts/velociraptor/commit/8bcf0249aed7de2a7fa73b34fa59de2779be91be))
* **git-hooks:** draft git hooks integration ([210f0b7](https://github.com/jurassiscripts/velociraptor/commit/210f0b7798abf0ff02391bfdd155159991a00d7e))
* **hooks:** add githook typing ([02abd70](https://github.com/jurassiscripts/velociraptor/commit/02abd7036e4ded0a209746bf2ada0e4eddc7649c))
* **hooks:** add hooks installation checks ([98c9f43](https://github.com/jurassiscripts/velociraptor/commit/98c9f43094127f2175e08e9eec2e1d9fd7a842a5))
* **hooks:** backup user-defined hooks before installing ([39ab6be](https://github.com/jurassiscripts/velociraptor/commit/39ab6be4ed60f4af89a9a620a55490fdcb884ba5))
* **hooks:** use git cli to get the correct git dir ([26ed86c](https://github.com/jurassiscripts/velociraptor/commit/26ed86c3a154227705203c3d044445d2627d0518))
* **run:** use PowerShell by default on Windows ([bb64b3e](https://github.com/jurassiscripts/velociraptor/commit/bb64b3e50b6ddec6f9a3b085e61f651a46f174d6))


### Bug Fixes

* **config:** add missing "write" permission flag ([4172957](https://github.com/jurassiscripts/velociraptor/commit/417295779ab170139e479b1b2c8c6622bbc3e225))
* **config:** prevent error when a config file is completely empty ([83f1bf9](https://github.com/jurassiscripts/velociraptor/commit/83f1bf953a6fae37fd42f7b63381410242084cc9))
* **hooks:** forward git hooks through a variable to avoid breaking scripts ([5ee07e0](https://github.com/jurassiscripts/velociraptor/commit/5ee07e0a46150757bbfb6381cc49263ffddf56ec))
* **hooks:** prevent git subprocess from printing errors ([a931a84](https://github.com/jurassiscripts/velociraptor/commit/a931a84db7c814a2688cb5cb97b1d9d2a48e144e))
* **hooks:** typo in hook script template ([0a14727](https://github.com/jurassiscripts/velociraptor/commit/0a147279428ae0d839a59ca613788e1ce21b1bfd))
* **scripts:** kill processes in addition to closing them on errors ([1b437b6](https://github.com/jurassiscripts/velociraptor/commit/1b437b65d6dd7b313e37f77399e4a841ed995f6a))
* **scripts:** use /x/process to correctly kill processes on all platforms ([13136e8](https://github.com/jurassiscripts/velociraptor/commit/13136e84402bae1323026ecc6734febc008fd13e))

## [1.0.0-beta.18](https://github.com/jurassiscripts/velociraptor/compare/1.0.0-beta.17...1.0.0-beta.18) (2021-03-21)


### Bug Fixes

* **cli:** fix shell completions ([216de2c](https://github.com/jurassiscripts/velociraptor/commit/216de2cf4f4fc312eda6f644d1feb4ff9e859193))

## [1.0.0-beta.17](https://github.com/umbopepato/velociraptor/compare/1.0.0-beta.16...1.0.0-beta.17) (2021-03-11)


### Features

* add env_file option ([ea486a9](https://github.com/umbopepato/velociraptor/commit/ea486a9dec0d3ea77d3836f1ee57b2d01a595f5d))

## [1.0.0-beta.16](https://github.com/umbopepato/velociraptor/compare/1.0.0-beta.15...1.0.0-beta.16) (2020-10-30)


### Features

* **cli:** add deno 1.5.0 new cli options ([eada07f](https://github.com/umbopepato/velociraptor/commit/eada07f106b23b99b3b7506b29706579cce0a5ce))


### Bug Fixes

* deno 1.5.0 incompatibility ([726a66c](https://github.com/umbopepato/velociraptor/commit/726a66c133e33dc4d2d4ab7438a812615b11b2d1))

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
