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
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var contractions = require('retext-contractions')

unified()
  .use(english)
  .use(contractions)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function(err, file) {
    console.error(report(err || file))
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

### `retext().use(contractions[, options])`

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
| -------- | -------- | ------- | ------ |
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

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-contractions.svg

[build]: https://travis-ci.org/retextjs/retext-contractions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-contractions.svg

[coverage]: https://codecov.io/github/retextjs/retext-contractions

[downloads-badge]: https://img.shields.io/npm/dm/retext-contractions.svg

[downloads]: https://www.npmjs.com/package/retext-contractions

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-contractions.svg

[size]: https://bundlephobia.com/result?p=retext-contractions

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/master/contributing.md

[support]: https://github.com/retextjs/.github/blob/master/support.md

[coc]: https://github.com/retextjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[quotes]: https://github.com/retextjs/retext-quotes

[literal]: https://github.com/syntax-tree/nlcst-is-literal

[message]: https://github.com/vfile/vfile-message
