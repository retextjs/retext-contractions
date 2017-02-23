'use strict';

var test = require('tape');
var retext = require('retext');
var contractions = require('./');

test('contractions(value)', function (t) {
  t.deepEqual(
    retext().use(contractions).processSync([
      'Well, it doesnt have to be so bad, yall.'
    ].join('\n')).messages.map(String),
    [
      '1:10-1:16: Expected an apostrophe in `doesnt`, like this: `doesn’t`',
      '1:36-1:40: Expected an apostrophe in `yall`, like this: `y’all`'
    ],
    'should catch contractions without apostrophes'
  );

  t.deepEqual(
    retext().use(contractions).processSync([
      'Well, it does’nt have to be so bad, ya\'ll.'
    ].join('\n')).messages.map(String),
    [
      '1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn’t`',
      '1:37-1:42: Expected the apostrophe in `ya\'ll` to be like this: `y’all`'
    ],
    'should catch contractions with incorrect apostrophes'
  );

  t.deepEqual(
    retext().use(contractions).processSync([
      'twas tis twere'
    ].join('\n')).messages.map(String),
    [
      '1:1-1:5: Expected an apostrophe in `twas`, like this: `’twas`',
      '1:6-1:9: Expected an apostrophe in `tis`, like this: `’tis`',
      '1:10-1:15: Expected an apostrophe in `twere`, like this: `’twere`'
    ],
    'should catch initial elisions'
  );

  t.deepEqual(
    retext().use(contractions).processSync([
      'It was acceptable in the 80s, I mean 80’s, no wait?'
    ].join('\n')).messages.map(String),
    [
      '1:26-1:29: Expected an apostrophe in `80s`, like this: `’80s`',
      '1:38-1:42: Expected the apostrophe in `80’s` to be like this: `’80s`'
    ],
    'should catch decades'
  );

  t.deepEqual(
    retext().use(contractions, {
      straight: true
    }).processSync([
      'Well, it does’nt have to be so bad, y’all.'
    ].join('\n')).messages.map(String),
    [
      '1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn\'t`',
      '1:37-1:42: Expected the apostrophe in `y’all` to be like this: `y\'all`'
    ],
    'should catch contractions without apostrophes'
  );

  t.deepEqual(
    retext().use(contractions).processSync([
      '“Twas” is misspelt.'
    ].join('\n')).messages.map(String),
    [],
    'should ignore literals by default'
  );

  t.deepEqual(
    retext().use(contractions, {allowLiterals: true}).processSync([
      '“Twas” is misspelt.'
    ].join('\n')).messages.map(String),
    ['1:2-1:6: Expected an apostrophe in `Twas`, like this: `’twas`'],
    'should allow literals when `allowLiterals: true`'
  );

  t.deepEqual(
    retext().use(contractions).processSync([
      'Well, it doesn’t have to be so bad, y’all.'
    ].join('\n')).messages.map(String),
    [],
    'should work'
  );

  t.end();
});
