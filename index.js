'use strict'

var visit = require('unist-util-visit')
var toString = require('nlcst-to-string')
var literal = require('nlcst-is-literal')
var rules = require('./index.json')

module.exports = contractions

// Regex to match an elided decade.
var decadeExpression = /^\d\ds$/
var apostropheExpression = /['’]/g
var source = 'retext-contractions'
var apostrophe = "'"
var rightSingleQuotationMark = '’'

var own = {}.hasOwnProperty

var data = initialize()

// Check contractions use.
function contractions(options) {
  var ignore = options && options.allowLiterals
  var straight = options && options.straight

  return transformer

  function transformer(tree, file) {
    visit(tree, 'WordNode', visitor)

    function visitor(node, index, parent) {
      var actual = toString(node)
      var normal = drop(actual)
      var expected
      var message

      // Suggest if either the straightened version is listed, or if this is a
      // decade (80’s and 80s > ’80s).
      if (own.call(data, normal)) {
        expected = data[normal]
      } else if (decadeExpression.test(normal)) {
        expected = apostrophe + normal
      }

      if (expected) {
        if (!straight) {
          expected = smarten(expected)
        }

        // Perfect.
        if (expected === actual) {
          return
        }

        // Ignore literal misspelt words: `like this: “hasnt”`.
        if (!ignore && literal(parent, index)) {
          return
        }

        if (normal === actual) {
          message = file.message(
            'Expected an apostrophe in `' +
              actual +
              '`, ' +
              'like this: `' +
              expected +
              '`',
            node
          )
        } else {
          message = file.message(
            'Expected the apostrophe in `' +
              actual +
              '` to be ' +
              'like this: `' +
              expected +
              '`',
            node
          )
        }

        message.source = source
        message.ruleId = source
        message.actual = actual
        message.expected = [expected]
      }
    }
  }
}

function initialize() {
  var result = {}
  var key
  var value

  for (key in rules) {
    value = rules[key]
    result[key] = value

    // Add upper- and sentence case as well.
    if (key === lower(key)) {
      result[upper(key)] = upper(value)
      result[sentence(key)] = sentence(value)
    }
  }

  return result
}

function lower(value) {
  return value.toLowerCase()
}

function upper(value) {
  return value.toUpperCase()
}

function sentence(value) {
  return upper(value.charAt(0)) + value.slice(1)
}

function smarten(value) {
  return value.replace(/'/g, rightSingleQuotationMark)
}

function drop(value) {
  return value.replace(apostropheExpression, '')
}
