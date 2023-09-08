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
    *   [`Options`](#options)
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
In Node.js (version 16+), install with [npm][]:

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
Well, it does’nt have to be so bad yall, it isnt like the 80s.
```

…and our module `example.js` contains:

```js
import retextContractions from 'retext-contractions'
import retextEnglish from 'retext-english'
import retextStringify from 'retext-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
  .use(retextEnglish)
  .use(retextContractions)
  .use(retextStringify)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…then running `node example.js` yields:

```txt
example.txt
1:10-1:17 warning Unexpected straight apostrophe in `does’nt`, expected `doesn’t` missing-smart-apostrophe retext-contractions
1:36-1:40 warning Unexpected missing apostrophe in `yall`, expected `y’all`       missing-smart-apostrophe retext-contractions
1:45-1:49 warning Unexpected missing apostrophe in `isnt`, expected `isn’t`       missing-smart-apostrophe retext-contractions

⚠ 3 warnings
```

## API

This package exports no identifiers.
The default export is [`retextContractions`][api-retext-contractions].

### `unified().use(retextContractions[, options])`

Check apostrophes in contractions.

###### Parameters

*   `options` ([`Options`][api-options], optional)
    — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

*   `allowLiterals` (`boolean`, default: `false`)
    — include [literal][nlcst-literal] phrases;
    normally they are ignored
*   `straight` (`boolean`, default: `false`)
    — suggest straight (`'`) instead of smart (`’`) apostrophes;
    see [`retext-quotes`][retext-quotes] if you want to properly check that
    though

## Messages

Each message is emitted as a [`VFileMessage`][vfile-message] on `file`, with
`source` set to `'retext-contractions'`, `ruleId` to
`'missing-smart-apostrophe'` or `'missing-straight-apostrophe'`,
`actual` to the unexpected value, and `expected` to the expected value.

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `retext-contractions@^5`,
compatible with Node.js 12.

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

[size-badge]: https://img.shields.io/bundlejs/size/retext-contractions

[size]: https://bundlejs.com/?q=retext-contractions

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

[nlcst-literal]: https://github.com/syntax-tree/nlcst-is-literal

[retext]: https://github.com/retextjs/retext

[retext-quotes]: https://github.com/retextjs/retext-quotes

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[vfile-message]: https://github.com/vfile/vfile-message

[api-retext-contractions]: #unifieduseretextcontractions-options

[api-options]: #options
