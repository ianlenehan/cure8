module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'object-curly-spacing': [2, 'always'],
    curly: ['error', 'multi'],
    'comma-dangle': '0',
    'react-hooks/exhaustive-deps': 'warn',
    'max-len': [
      'warn',
      { code: 120, ignoreUrls: true, ignoreTrailingComments: true }
    ]
  }
};
