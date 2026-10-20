# form-validation (vendored)

Another student's module, used by Kvitt to validate its forms.

| | |
| --- | --- |
| Source | https://github.com/Fielifia/form-validation |
| Commit | `7db3255c61f88e79849cfe21b225c7d1afdbd13c` (2026-09-30) |
| Author | Fielifia |
| License | ISC — see [LICENSE](LICENSE) |

## Why it is copied

The module is not published to npm and its `package.json` has no `main` or `exports`, so it cannot
be installed as a dependency. The source code in `src/` is copied here **unchanged**, so that the
module stays a separate project. Only `src/` and `LICENSE` are included; the module's own tests and
test app are left out.

## Do not edit

Nothing in this directory is changed. Kvitt only uses the module through `src/FormValidator.js`,
which is the single place in the application that knows this module exists. Problems found in the
module are documented in Kvitt's `TEST_REPORT.md`, not fixed here.
