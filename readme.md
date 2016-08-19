# retext-contractions [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check apostrophes in elided contractions: if they exist (`isnt` >
`isn’t`) and if they are placed properly (`is’nt` > `isn’t`).  All with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-contractions
```

## Usage

```javascript
var retext = require('retext');
var english = require('retext-english');
var contractions = require('retext-contractions');
var report = require('vfile-reporter');

retext().use(english).use(contractions).process([
  'Well, it does’nt have to be so bad yall, it isnt like the 80’s.'
].join('\n'), function (err, file) {
  console.log(report(err || file));
});
```

Yields:

```text
  1:10-1:17  warning  Expected the apostrophe in `does’nt` to be like this: `doesn’t`  retext-contractions
  1:36-1:40  warning  Expected an apostrophe in `yall`, like this: `y’all`             retext-contractions
  1:45-1:49  warning  Expected an apostrophe in `isnt`, like this: `isn’t`             retext-contractions
  1:59-1:63  warning  Expected the apostrophe in `80’s` to be like this: `’80s`        retext-contractions

⚠ 4 warnings
```

## API

### `retext().use(contractions[, options])`

Emit warnings when a) elided contractions don’t have their required
apostrophe, and b) when that apostrophe isn’t placed correctly.

###### `options`

*   `straight` (`boolean`, default: `false`)
    — Suggest straight (`'`) instead of smart (`’`) apostrophes.
    Use [**retext-quotes**][quotes] if you want to properly check
    that though.
*   `allowLiterals` (`boolean`, default: `false`)
    — Include [literal][] phrases (the default is to ignore them).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-contractions.svg

[travis]: https://travis-ci.org/wooorm/retext-contractions

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-contractions.svg

[codecov]: https://codecov.io/github/wooorm/retext-contractions

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[quotes]: https://github.com/wooorm/retext-quotes

[literal]: https://github.com/wooorm/nlcst-is-literal
