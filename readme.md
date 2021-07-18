# retext-contractions

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to check apostrophes in elided contractions: if they
exist (`isnt` > `isn’t`) and if they are placed properly (`is’nt` > `isn’t`).

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install retext-contractions
```

## Use

Say we have the following file, `example.txt`:

```txt
Well, it does’nt have to be so bad yall, it isnt like the 80’s.
```

…and our script, `example.js`, looks like this:

```js
import {readSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import retextEnglish from 'retext-english'
import retextContractions from 'retext-contractions'
import retextStringify from 'retext-stringify'

const file = readSync('example.txt')

unified()
  .use(retextEnglish)
  .use(retextContractions)
  .use(retextStringify)
  .process(file, (file) => {
    console.error(reporter(file))
  })
```

Now, running `node example` yields:

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

### `retext().use(retextContractions[, options])`

Emit warnings when a) elided contractions don’t have their required apostrophe,
and b) when that apostrophe isn’t placed correctly.

##### `options`

###### `options.straight`

Suggest straight (`'`) instead of smart (`’`) apostrophes (`boolean`, default:
`false`).
Use [`retext-quotes`][quotes] if you want to properly check that though.

###### `options.allowLiterals`

Include [literal][] phrases (`boolean`, default: `false`).
The default is to ignore them.

### Messages

The following [`VFileMessage`][message]s are used:

| `source` | `ruleId` | Example | Reason |
| - | - | - | - |
| `retext-contractions` | `missing-smart-apostrophe` | `Yall` | Expected an apostrophe in `Yall`, like this: `Y’all` |
| `retext-contractions` | `missing-straight-apostrophe` | `Yall`, with `straight: true` | Expected an apostrophe in `Dont`, like this: `Don't` |
| `retext-contractions` | `straight-apostrophe` | `Don't` | Expected the apostrophe in `Don't` to be like this: `Don’t` |
| `retext-contractions` | `smart-apostrophe` | `Don’t`, with `straight: true` | Expected the apostrophe in `Don’t` to be like this: `Don't` |

The offending value is stored at `message.actual`, and the suggested values are
stored at `message.expected`.

## Related

*   [`retext-diacritics`](https://github.com/retextjs/retext-diacritics)
    — Check for proper use of diacritics
*   [`retext-quotes`](https://github.com/retextjs/retext-quotes)
    — Check quote and apostrophe usage
*   [`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
    — Check spacing between sentences

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

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/retextjs/.github/blob/HEAD/support.md

[coc]: https://github.com/retextjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[quotes]: https://github.com/retextjs/retext-quotes

[literal]: https://github.com/syntax-tree/nlcst-is-literal

[message]: https://github.com/vfile/vfile-message
