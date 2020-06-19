'use strict'

var test = require('tape')
var retext = require('retext')
var contractions = require('.')

test('contractions(value)', function (t) {
  t.deepEqual(
    JSON.parse(
      JSON.stringify(retext().use(contractions).processSync('Yall.').messages)
    ),
    [
      {
        message: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
        name: '1:1-1:5',
        reason: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
        line: 1,
        column: 1,
        location: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 1, column: 5, offset: 4}
        },
        source: 'retext-contractions',
        ruleId: 'missing-smart-apostrophe',
        fatal: false,
        actual: 'Yall',
        expected: ['Y’all']
      }
    ],
    'should message for missing smart apostrophes'
  )

  t.deepEqual(
    retext()
      .use(contractions, {straight: true})
      .processSync('Dont.')
      .messages.map(String),
    ["1:1-1:5: Expected an apostrophe in `Dont`, like this: `Don't`"],
    'should message for missing straight apostrophes'
  )

  t.deepEqual(
    retext().use(contractions).processSync("Don't.").messages.map(String),
    ["1:1-1:6: Expected the apostrophe in `Don't` to be like this: `Don’t`"],
    'should message for an expected smart apostrophe'
  )

  t.deepEqual(
    retext()
      .use(contractions, {straight: true})
      .processSync('Don’t.')
      .messages.map(String),
    ["1:1-1:6: Expected the apostrophe in `Don’t` to be like this: `Don't`"],
    'should message for an expected straight apostrophe'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync('Well, it doesnt have to be so bad, yall.')
      .messages.map(String),
    [
      '1:10-1:16: Expected an apostrophe in `doesnt`, like this: `doesn’t`',
      '1:36-1:40: Expected an apostrophe in `yall`, like this: `y’all`'
    ],
    'should catch contractions without apostrophes'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync("Well, it does’nt have to be so bad, ya'll.")
      .messages.map(String),
    [
      '1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn’t`',
      "1:37-1:42: Expected the apostrophe in `ya'll` to be like this: `y’all`"
    ],
    'should catch contractions with incorrect apostrophes'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync('twas tis twere')
      .messages.map(String),
    [
      '1:1-1:5: Expected an apostrophe in `twas`, like this: `’twas`',
      '1:6-1:9: Expected an apostrophe in `tis`, like this: `’tis`',
      '1:10-1:15: Expected an apostrophe in `twere`, like this: `’twere`'
    ],
    'should catch initial elisions'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync(
        ['It was acceptable in the 80s, I mean 80’s, no wait?'].join('\n')
      )
      .messages.map(String),
    [],
    'should ignore decades (GH-7)'
  )

  t.deepEqual(
    retext()
      .use(contractions, {straight: true})
      .processSync(['Well, it does’nt have to be so bad, y’all.'].join('\n'))
      .messages.map(String),
    [
      "1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn't`",
      "1:37-1:42: Expected the apostrophe in `y’all` to be like this: `y'all`"
    ],
    'should catch contractions without apostrophes'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync(['“Twas” is misspelt.'].join('\n'))
      .messages.map(String),
    [],
    'should ignore literals by default'
  )

  t.deepEqual(
    retext()
      .use(contractions, {allowLiterals: true})
      .processSync(['“Twas” is misspelt.'].join('\n'))
      .messages.map(String),
    ['1:2-1:6: Expected an apostrophe in `Twas`, like this: `’twas`'],
    'should allow literals when `allowLiterals: true`'
  )

  t.deepEqual(
    retext()
      .use(contractions)
      .processSync(['Well, it doesn’t have to be so bad, y’all.'].join('\n'))
      .messages.map(String),
    [],
    'should work'
  )

  t.end()
})
