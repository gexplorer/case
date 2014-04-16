// Copyright (C) 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * @fileoverview
 * Registers a language handler for case.
 *
 *
 * To use, include prettify.js and this file in your HTML page.
 * Then put your code in an HTML tag like
 *      <pre class="prettyprint lang-case"></pre>
 *
 *
 *
 * @author gexplorer8@gmail.com
 */

// This file is a call to a function defined in prettify.js which defines a
// lexical scanner for case and maps tokens to styles.

// The call to PR['registerLangHandler'] is quoted so that Closure Compiler
// will not rename the call so that this language extensions can be
// compiled/minified separately from one another.  Other symbols defined in
// prettify.js are similarly quoted.

// The call is structured thus:
// PR['registerLangHandler'](
//    PR['createSimpleLexer'](
//        shortcutPatterns,
//        fallThroughPatterns),
//    [languageId0, ..., languageIdN])

// Langugage IDs
// =============
// The language IDs are typically the file extensions of source files for
// that language so that users can syntax highlight arbitrary files based
// on just the extension.  This is heuristic, but works pretty well in
// practice.

// Patterns
// ========
// Lexers are typically implemented as a set of regular expressions.
// The SimpleLexer function takes regular expressions, styles, and some
// pragma-info and produces a lexer.  A token description looks like
//   [STYLE_NAME, /regular-expression/, pragmas]

// Initially, simple lexer's inner loop looked like:

//    while sourceCode is not empty:
//      try each regular expression in order until one matches
//      remove the matched portion from sourceCode

// This was really slow for large files because some JS interpreters
// do a buffer copy on the matched portion which is O(n*n)

// The current loop now looks like

//    1. use js-modules/combinePrefixPatterns.js to 
//       combine all regular expressions into one 
//    2. use a single global regular expresion match to extract all tokens
//    3. for each token try regular expressions in order until one matches it
//       and classify it using the associated style

// This is a lot more efficient but it does mean that lookahead and lookbehind
// can't be used across boundaries to classify tokens.

// Sometimes we need lookahead and lookbehind and sometimes we want to handle
// embedded language -- JavaScript or CSS embedded in HTML, or inline assembly
// in C.

// If a particular pattern has a numbered group, and its style pattern starts
// with "lang-" as in
//    ['lang-js', /<script>(.*?)<\/script>/]
// then the token classification step breaks the token into pieces.
// Group 1 is re-parsed using the language handler for "lang-js", and the
// surrounding portions are reclassified using the current language handler.
// This mechanism gives us both lookahead, lookbehind, and language embedding.

// Shortcut Patterns
// =================
// A shortcut pattern is one that is tried before other patterns if the first
// character in the token is in the string of characters.
// This very effectively lets us make quick correct decisions for common token
// types.

// All other patterns are fall-through patterns.



// The comments inline below refer to productions in the case specification's
// lexical grammar.  See link above.

PR['registerLangHandler'](
    PR['createSimpleLexer'](
      [],
      [
        [PR['PR_STRING'],
          /(@\w+)/i],
        [PR['PR_KEYWORD'],
          /(#\w+)/i],
        [PR['PR_TYPE'],
          /(:\w+)/i]
      ]),
    ['case']);