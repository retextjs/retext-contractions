import test from 'tape'
import {retext} from 'retext'
import retextContractions from './index.js'

test('retext-contractions', (t) => {
  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        retext().use(retextContractions).processSync('Yall.').messages
      )
    ),
    [
      {
        name: '1:1-1:5',
        message: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
        reason: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
        line: 1,
        column: 1,
        source: 'retext-contractions',
        ruleId: 'missing-smart-apostrophe',
        position: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 1, column: 5, offset: 4}
        },
        fatal: false,
        actual: 'Yall',
        expected: ['Y’all']
      }
    ],
    'should message for missing smart apostrophes'
  )

  t.deepEqual(
    retext()
      .use(retextContractions, {straight: true})
      .processSync('Dont.')
      .messages.map((d) => String(d)),
    ["1:1-1:5: Expected an apostrophe in `Dont`, like this: `Don't`"],
    'should message for missing straight apostrophes'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync("Don't.")
      .messages.map((d) => String(d)),
    ["1:1-1:6: Expected the apostrophe in `Don't` to be like this: `Don’t`"],
    'should message for an expected smart apostrophe'
  )

  t.deepEqual(
    retext()
      .use(retextContractions, {straight: true})
      .processSync('Don’t.')
      .messages.map((d) => String(d)),
    ["1:1-1:6: Expected the apostrophe in `Don’t` to be like this: `Don't`"],
    'should message for an expected straight apostrophe'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync('Well, it doesnt have to be so bad, yall.')
      .messages.map((d) => String(d)),
    [
      '1:10-1:16: Expected an apostrophe in `doesnt`, like this: `doesn’t`',
      '1:36-1:40: Expected an apostrophe in `yall`, like this: `y’all`'
    ],
    'should catch contractions without apostrophes'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync("Well, it does’nt have to be so bad, ya'll.")
      .messages.map((d) => String(d)),
    [
      '1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn’t`',
      "1:37-1:42: Expected the apostrophe in `ya'll` to be like this: `y’all`"
    ],
    'should catch contractions with incorrect apostrophes'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync('twas tis twere')
      .messages.map((d) => String(d)),
    [
      '1:1-1:5: Expected an apostrophe in `twas`, like this: `’twas`',
      '1:6-1:9: Expected an apostrophe in `tis`, like this: `’tis`',
      '1:10-1:15: Expected an apostrophe in `twere`, like this: `’twere`'
    ],
    'should catch initial elisions'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync('It was acceptable in the 80s, I mean 80’s, no wait?')
      .messages.map((d) => String(d)),
    [],
    'should ignore decades (GH-7)'
  )

  t.deepEqual(
    retext()
      .use(retextContractions, {straight: true})
      .processSync('Well, it does’nt have to be so bad, y’all.')
      .messages.map((d) => String(d)),
    [
      "1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn't`",
      "1:37-1:42: Expected the apostrophe in `y’all` to be like this: `y'all`"
    ],
    'should catch contractions without apostrophes'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync('“Twas” is misspelt.')
      .messages.map((d) => String(d)),
    [],
    'should ignore literals by default'
  )

  t.deepEqual(
    retext()
      .use(retextContractions, {allowLiterals: true})
      .processSync('“Twas” is misspelt.')
      .messages.map((d) => String(d)),
    ['1:2-1:6: Expected an apostrophe in `Twas`, like this: `’twas`'],
    'should allow literals when `allowLiterals: true`'
  )

  t.deepEqual(
    retext()
      .use(retextContractions)
      .processSync('Well, it doesn’t have to be so bad, y’all.')
      .messages.map((d) => String(d)),
    [],
    'should work'
  )

  t.end()
})
