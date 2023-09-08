import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import retextContractions from './index.js'

test('retextContractions', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

  await t.test(
    'should message for missing smart apostrophes',
    async function () {
      const file = await retext().use(retextContractions).process('Yall.')

      assert.deepEqual(
        JSON.parse(JSON.stringify({...file.messages[0], ancestors: []})),
        {
          ancestors: [],
          column: 1,
          fatal: false,
          message: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
          line: 1,
          name: '1:1-1:5',
          place: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 5, offset: 4}
          },
          reason: 'Expected an apostrophe in `Yall`, like this: `Y’all`',
          ruleId: 'missing-smart-apostrophe',
          source: 'retext-contractions',
          actual: 'Yall',
          expected: ['Y’all'],
          url: 'https://github.com/retextjs/retext-contractions#readme'
        }
      )
    }
  )

  await t.test(
    'should message for missing straight apostrophes',
    async function () {
      const file = await retext()
        .use(retextContractions, {straight: true})
        .process('Dont.')

      assert.deepEqual(file.messages.map(String), [
        "1:1-1:5: Expected an apostrophe in `Dont`, like this: `Don't`"
      ])
    }
  )

  await t.test(
    'should message for an expected smart apostrophe',
    async function () {
      const file = await retext().use(retextContractions).process("Don't.")

      assert.deepEqual(file.messages.map(String), [
        "1:1-1:6: Expected the apostrophe in `Don't` to be like this: `Don’t`"
      ])
    }
  )

  await t.test(
    'should message for an expected straight apostrophe',
    async function () {
      const file = await retext()
        .use(retextContractions, {straight: true})
        .process('Don’t.')

      assert.deepEqual(file.messages.map(String), [
        "1:1-1:6: Expected the apostrophe in `Don’t` to be like this: `Don't`"
      ])
    }
  )

  await t.test(
    'should catch contractions without apostrophes',
    async function () {
      const file = await retext()
        .use(retextContractions)
        .process('Well, it doesnt have to be so bad, yall.')

      assert.deepEqual(file.messages.map(String), [
        '1:10-1:16: Expected an apostrophe in `doesnt`, like this: `doesn’t`',
        '1:36-1:40: Expected an apostrophe in `yall`, like this: `y’all`'
      ])
    }
  )

  await t.test(
    'should catch contractions with incorrect apostrophes',
    async function () {
      const file = await retext()
        .use(retextContractions)
        .process("Well, it does’nt have to be so bad, ya'll.")

      assert.deepEqual(file.messages.map(String), [
        '1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn’t`',
        "1:37-1:42: Expected the apostrophe in `ya'll` to be like this: `y’all`"
      ])
    }
  )

  await t.test('should catch initial elisions', async function () {
    const file = await retext()
      .use(retextContractions)
      .process('twas tis twere')

    assert.deepEqual(file.messages.map(String), [
      '1:1-1:5: Expected an apostrophe in `twas`, like this: `’twas`',
      '1:6-1:9: Expected an apostrophe in `tis`, like this: `’tis`',
      '1:10-1:15: Expected an apostrophe in `twere`, like this: `’twere`'
    ])
  })

  await t.test('should ignore decades (GH-7)', async function () {
    const file = await retext()
      .use(retextContractions)
      .process('It was acceptable in the 80s, I mean 80’s, no wait?')

    assert.deepEqual(file.messages.map(String), [])
  })

  await t.test(
    'should catch contractions without apostrophes',
    async function () {
      const file = await retext()
        .use(retextContractions, {straight: true})
        .process('Well, it does’nt have to be so bad, y’all.')

      assert.deepEqual(file.messages.map(String), [
        "1:10-1:17: Expected the apostrophe in `does’nt` to be like this: `doesn't`",
        "1:37-1:42: Expected the apostrophe in `y’all` to be like this: `y'all`"
      ])
    }
  )

  await t.test('should ignore literals by default', async function () {
    const file = await retext()
      .use(retextContractions)
      .process('“Twas” is misspelt.')

    assert.deepEqual(file.messages.map(String), [])
  })

  await t.test(
    'should allow literals when `allowLiterals: true`',
    async function () {
      const file = await retext()
        .use(retextContractions, {allowLiterals: true})
        .process('“Twas” is misspelt.')

      assert.deepEqual(file.messages.map(String), [
        '1:2-1:6: Expected an apostrophe in `Twas`, like this: `’twas`'
      ])
    }
  )

  await t.test('should work', async function () {
    const file = await retext()
      .use(retextContractions)
      .process('Well, it doesn’t have to be so bad, y’all.')

    assert.deepEqual(file.messages.map(String), [])
  })
})
