import {visit} from 'unist-util-visit'
import {toString} from 'nlcst-to-string'
import {isLiteral} from 'nlcst-is-literal'
import {list} from './list.js'

// Rules.
const source = 'retext-contractions'

const own = {}.hasOwnProperty

const data = initialize()

// Check contractions use.
export default function retextContractions(options = {}) {
  const ignore = options.allowLiterals
  const straight = options.straight

  return (tree, file) => {
    visit(tree, 'WordNode', (node, index, parent) => {
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
          (!ignore && isLiteral(parent, index))
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
          {actual, expected: [expected]}
        )
      }
    })
  }
}

function initialize() {
  const result = {}
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
