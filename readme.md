# retext-contractions [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

Check apostrophes in elided contractions: if they exist (`isnt` >
`isn’t`) and if they are placed properly (`is’nt` > `isn’t`).  All with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-contractions
```

## Usage

Say we have the following file, `example.txt`:

```text
Well, it does’nt have to be so bad yall, it isnt like the 80’s.
```

And our script, `example.js`, looks like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var contractions = require('retext-contractions');

unified()
  .use(english)
  .use(contractions)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function (err, file) {
    console.error(report(err || file));
  });
```

Now, running `node example` yields:

```text
example.txt
  1:10-1:17  warning  Expected the apostrophe in `does’nt` to be like this: `doesn’t`  retext-contractions  retext-contractions
  1:36-1:40  warning  Expected an apostrophe in `yall`, like this: `y’all`             retext-contractions  retext-contractions
  1:45-1:49  warning  Expected an apostrophe in `isnt`, like this: `isn’t`             retext-contractions  retext-contractions
  1:59-1:63  warning  Expected the apostrophe in `80’s` to be like this: `’80s`        retext-contractions  retext-contractions

⚠ 4 warnings
```

## API

### `retext().use(contractions[, options])`

Emit warnings when a) elided contractions don’t have their required
apostrophe, and b) when that apostrophe isn’t placed correctly.

##### `options`

###### `options.straight`

`boolean`, default: `false` — Suggest straight (`'`) instead of smart (`’`)
apostrophes.  Use [**retext-quotes**][quotes] if you want to properly check
that though.

###### `options.allowLiterals`

`boolean`, default: `false` — Include [literal][] phrases (the default is
to ignore them).

## Related

*   [`retext-diacritics`](https://github.com/retextjs/retext-diacritics)
    — Check for proper use of diacritics
*   [`retext-quotes`](https://github.com/retextjs/retext-quotes)
    — Check quote and apostrophe usage
*   [`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
    — Check spacing between sentences

## Contribute

See [`contributing.md` in `retextjs/retext`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-contractions.svg

[build]: https://travis-ci.org/retextjs/retext-contractions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-contractions.svg

[coverage]: https://codecov.io/github/retextjs/retext-contractions

[downloads-badge]: https://img.shields.io/npm/dm/retext-contractions.svg

[downloads]: https://www.npmjs.com/package/retext-contractions

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm-install]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[quotes]: https://github.com/retextjs/retext-quotes

[literal]: https://github.com/syntax-tree/nlcst-is-literal

[contributing]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
