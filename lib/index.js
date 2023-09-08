/**
 * @typedef {import('nlcst').Root} Root
 *
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowLiterals=false]
 *   Include literal phrases (default: `false`);
 *   Normally they are ignored.
 * @property {boolean | null | undefined} [straight=false]
 *   Suggest straight (`'`) instead of smart (`’`) apostrophes (default:
 *   `false`); see `retext-quotes` if you want to properly check that though.
 */

import {isLiteral} from 'nlcst-is-literal'
import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'
import {list} from './list.js'

const data = createMap()

/** @type {Readonly<Options>} */
const emptyOptions = {}

/**
 * Check contractions use.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function retextContractions(options) {
  const settings = options || emptyOptions
  const allowLiterals = settings.allowLiterals
  const straight = settings.straight

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, 'WordNode', function (node, index, parent) {
      const actual = toString(node)
      const normal = actual.replace(/['’]/g, '')
      let expected = data.get(normal)

      // Suggest if the straightened version is listed.
      if (expected) {
        if (!straight) {
          expected = expected.replace(/'/g, '’')
        }

        if (
          // Perfect.
          actual === expected ||
          // Ignore literal misspelt words: `like this: “hasnt”`.
          (parent &&
            index !== undefined &&
            !allowLiterals &&
            isLiteral(parent, index))
        ) {
          return
        }

        const message = file.message(
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
          {
            /* c8 ignore next -- verbose to test */
            ancestors: parent ? [parent, node] : [node],
            place: node.position,
            ruleId:
              'missing-' + (straight ? 'straight' : 'smart') + '-apostrophe',
            source: 'retext-contractions'
          }
        )

        message.actual = actual
        message.expected = [expected]
        message.url = 'https://github.com/retextjs/retext-contractions#readme'
      }
    })
  }
}

/**
 * @returns {Map<string, string>}
 *   Expanded map.
 */
function createMap() {
  /** @type {Map<string, string>} */
  const result = new Map()
  /** @type {string} */
  let key

  for (key in list) {
    if (Object.hasOwn(list, key)) {
      const value = list[key]

      result.set(key, value)

      // Add upper- and sentence case as well.
      if (key === key.toLowerCase()) {
        result.set(key.toUpperCase(), value.toUpperCase())
        result.set(
          key.charAt(0).toUpperCase() + key.slice(1),
          value.charAt(0).toUpperCase() + value.slice(1)
        )
      }
    }
  }

  return result
}
