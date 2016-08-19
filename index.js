/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module retext-contractions
 * @fileoverview Check apostrophe use in contractions:
 *   `aint` > `ain’t`, `have’nt` > `haven’t`, &c.
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var toString = require('nlcst-to-string');
var literal = require('nlcst-is-literal');
var has = require('has');
var rules = require('./index.json');

/* Expose. */
module.exports = contractions;

/* Regex to match a elided decade. */
var DECADE = /^\d\ds$/;

var data = {};

initialize();

/**
 * Check contractions use.
 */
function contractions(processor, options) {
  var ignore = options && options.allowLiterals;
  var straight = options && options.straight;

  return function (tree, file) {
    visit(tree, 'WordNode', function (node, index, parent) {
      var source = toString(node);
      var value = drop(source);
      var apostrophe = value !== source;
      var suggestion;
      var message;

      /* Suggest if either the straightened version is listed,
       * or if this is a decade (80’s and 80s > ’80s). */
      if (has(data, value)) {
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

        message.ruleId = message.source = 'retext-contractions';
      }
    });
  };
}

function initialize() {
  var key;
  var value;

  for (key in rules) {
    value = data[key] = rules[key];

    /* Add upper- and sentence case as well. */
    if (key === lower(key)) {
      data[upper(key)] = upper(value);
      data[sentence(key)] = sentence(value);
    }
  }
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
