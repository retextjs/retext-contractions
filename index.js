'use strict';

var visit = require('unist-util-visit');
var toString = require('nlcst-to-string');
var literal = require('nlcst-is-literal');
var rules = require('./index.json');

module.exports = contractions;

/* Regex to match a elided decade. */
var DECADE = /^\d\ds$/;

var own = {}.hasOwnProperty;

var data = initialize();

/* Check contractions use. */
function contractions(options) {
  var ignore = options && options.allowLiterals;
  var straight = options && options.straight;

  return transformer;

  function transformer(tree, file) {
    visit(tree, 'WordNode', visitor);

    function visitor(node, index, parent) {
      var source = toString(node);
      var value = drop(source);
      var apostrophe = value !== source;
      var suggestion;
      var message;

      /* Suggest if either the straightened version is listed,
       * or if this is a decade (80’s and 80s > ’80s). */
      if (own.call(data, value)) {
        suggestion = data[value];
      } else if (DECADE.test(value)) {
        suggestion = '\'' + value;
      }

      if (suggestion) {
        if (!straight) {
          suggestion = smarten(suggestion);
        }

        /* Perfect. */
        if (suggestion === source) {
          return;
        }

        /* Ignore literal misspelt words: `like this: “hasnt”`. */
        if (!ignore && literal(parent, index)) {
          return;
        }

        if (apostrophe) {
          message = file.warn(
            'Expected the apostrophe in `' + source + '` to be ' +
            'like this: `' + suggestion + '`',
            node
          );
        } else {
          message = file.warn(
            'Expected an apostrophe in `' + source + '`, ' +
            'like this: `' + suggestion + '`',
            node
          );
        }

        message.source = 'retext-contractions';
        message.ruleId = 'retext-contractions';
        message.actual = source;
        message.expected = [suggestion];
      }
    }
  }
}

function initialize() {
  var result = {};
  var key;
  var value;

  for (key in rules) {
    value = rules[key];
    result[key] = value;

    /* Add upper- and sentence case as well. */
    if (key === lower(key)) {
      result[upper(key)] = upper(value);
      result[sentence(key)] = sentence(value);
    }
  }

  return result;
}

function lower(value) {
  return value.toLowerCase();
}

function upper(value) {
  return value.toUpperCase();
}

function sentence(value) {
  return upper(value.charAt(0)) + value.slice(1);
}

function smarten(value) {
  return value.replace(/'/g, '’');
}

function drop(value) {
  return value.replace(/['’]/g, '');
}
