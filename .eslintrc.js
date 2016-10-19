module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // Custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // require spaces around interpolation curly brackets
    'template-curly-spacing': [ 2, 'always' ],
    // allow multiple variable declarations in line
    'one-var':                [ 2, 'always' ],
    'indent':                 [ 2, 2, { 'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 } } ],
    'key-spacing':            [ 2, { align: "value", "afterColon": true } ],
    'no-multi-spaces':        [ 2, { exceptions: { 'VariableDeclarator': true, 'Property': true } } ],
    'key-spacing':            [ 2, { align: 'value' } ],
    'array-bracket-spacing':  'off'
  }
}
