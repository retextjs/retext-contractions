/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').Sentence} Sentence
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean} [allowLiterals=false]
 *   Suggest straight (`'`) instead of smart (`’`) apostrophes.
 *   Use `retext-quotes` if you want to properly check that though.
 * @property {boolean} [straight=false]
 *   Include literal phrases.
 *   The default is to ignore them.
 */

import {visit} from 'unist-util-visit'
import {toString} from 'nlcst-to-string'
import {isLiteral} from 'nlcst-is-literal'
import {list} from './list.js'

// Rules.
const source = 'retext-contractions'
const url = 'https://github.com/retextjs/retext-contractions#readme'

const own = {}.hasOwnProperty

const data = initialize()

/**
 * Plugin to check contractions use.
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
export default function retextContractions(options = {}) {
  const ignore = options.allowLiterals
  const straight = options.straight

  return (tree, file) => {
    visit(tree, 'WordNode', (node, index, parent_) => {
      const parent = /** @type {Sentence} */ (parent_)
      const actual = toString(node)
      const normal = actual.replace(/['’]/g, '')

      // Suggest if the straightened version is listed.
      if (own.call(data, normal)) {
        let expected = data[normal]

        if (!straight) {
          expected = expected.replace(/'/g, '’')
        }

        if (
          // Perfect.
          actual === expected ||
          // Ignore literal misspelt words: `like this: “hasnt”`.
          (parent && index !== null && !ignore && isLiteral(parent, index))
        ) {
          return
        }

        Object.assign(
          file.message(
            normal === actual
              ? 'Expected an apostrophe in `' +
                  actual +
                  '`, ' +
                  'like this: `' +
                  expected +
                  '`'
              : 'Expected the apostrophe in `' +
                  actual +
                  '` to be ' +
                  'like this: `' +
                  expected +
                  '`',
            node,
            [
              source,
              (normal === actual ? 'missing-' : '') +
                (straight ? 'straight-apostrophe' : 'smart-apostrophe')
            ].join(':')
          ),
          {actual, expected: [expected], url}
        )
      }
    })
  }
}

/** @returns {Record<string, string>} */
function initialize() {
  /** @type {Record<string, string>} */
  const result = {}
  /** @type {string} */
  let key

  for (key in list) {
    if (own.call(list, key)) {
      const value = list[key]

      result[key] = value

      // Add upper- and sentence case as well.
      if (key === key.toLowerCase()) {
        result[key.toUpperCase()] = value.toUpperCase()
        result[key.charAt(0).toUpperCase() + key.slice(1)] =
          value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }

  return result
}
