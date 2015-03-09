module.exports = {
  rules: {
    'ext-array-foreach': require('./lib/rules/ext-array-foreach'),
    'ext-deps': require('./lib/rules/ext-deps'),
    'no-ext-create': require('./lib/rules/no-ext-create'),
    'no-ext-multi-def': require('./lib/rules/no-ext-multi-def')
  },
  rulesConfig: {
    'ext-array-foreach': 0,
    'ext-deps': 0,
    'no-ext-create': 0,
    'no-ext-multi-def': 0
  }
};
