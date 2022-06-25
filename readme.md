# retext-contractions

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check apostrophes in contractions.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextContractions[, options])`](#unifieduseretextcontractions-options)
*   [Messages](#messages)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to check apostrophes in
elided contractions.
It checks whether they exist (`isnt` > `isn’t`) and if they are placed
correctly (`is’nt` > `isn’t`).

## When should I use this?

You can opt-into this plugin when you’re dealing with content that might contain
grammar mistakes, and have authors that can fix that content.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install retext-contractions
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextContractions from 'https://esm.sh/retext-contractions@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextContractions from 'https://esm.sh/retext-contractions@5?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
Well, it does’nt have to be so bad yall, it isnt like the 80’s.
```

…and our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import retextEnglish from 'retext-english'
import retextContractions from 'retext-contractions'
import retextStringify from 'retext-stringify'

const file = await unified()
  .use(retextEnglish)
  .use(retextContractions)
  .use(retextStringify)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…now running `node example.js` yields:

```txt
example.txt
  1:10-1:17  warning  Expected the apostrophe in `does’nt` to be like this: `doesn’t`  retext-contractions  retext-contractions
  1:36-1:40  warning  Expected an apostrophe in `yall`, like this: `y’all`             retext-contractions  retext-contractions
  1:45-1:49  warning  Expected an apostrophe in `isnt`, like this: `isn’t`             retext-contractions  retext-contractions
  1:59-1:63  warning  Expected the apostrophe in `80’s` to be like this: `’80s`        retext-contractions  retext-contractions

⚠ 4 warnings
```

## API

This package exports no identifiers.
The default export is `retextContractions`.

### `unified().use(retextContractions[, options])`

Check apostrophes in contractions.

##### `options`

Configuration (optional).

###### `options.straight`

Suggest straight (`'`) instead of smart (`’`) apostrophes (`boolean`, default:
`false`).
Use [`retext-quotes`][retext-quotes] if you want to properly check that though.

###### `options.allowLiterals`

Include [literal][] phrases (`boolean`, default: `false`).
The default is to ignore them.

## Messages

The following [`VFileMessage`][vfile-message]s are used:

| `source` | `ruleId` | Example | Reason |
| - | - | - | - |
| `retext-contractions` | `missing-smart-apostrophe` | `Yall` | Expected an apostrophe in `Yall`, like this: `Y’all` |
| `retext-contractions` | `missing-straight-apostrophe` | `Yall`, with `straight: true` | Expected an apostrophe in `Dont`, like this: `Don't` |
| `retext-contractions` | `straight-apostrophe` | `Don't` | Expected the apostrophe in `Don't` to be like this: `Don’t` |
| `retext-contractions` | `smart-apostrophe` | `Don’t`, with `straight: true` | Expected the apostrophe in `Don’t` to be like this: `Don't` |

The offending value is stored at `message.actual`, and the suggested values are
stored at `message.expected`.

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`retext-diacritics`](https://github.com/retextjs/retext-diacritics)
    — check for proper use of diacritics
*   [`retext-quotes`](https://github.com/retextjs/retext-quotes)
    — check quote and apostrophe usage
*   [`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
    — check spacing between sentences

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-contractions/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-contractions/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-contractions.svg

[coverage]: https://codecov.io/github/retextjs/retext-contractions

[downloads-badge]: https://img.shields.io/npm/dm/retext-contractions.svg

[downloads]: https://www.npmjs.com/package/retext-contractions

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-contractions.svg

[size]: https://bundlephobia.com/result?p=retext-contractions

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[retext]: https://github.com/retextjs/retext

[retext-quotes]: https://github.com/retextjs/retext-quotes

[literal]: https://github.com/syntax-tree/nlcst-is-literal

[vfile-message]: https://github.com/vfile/vfile-message
