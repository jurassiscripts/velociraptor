
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
