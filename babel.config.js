module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
  ['@babel/plugin-transform-class-properties', { loose: true }],
  ['@babel/plugin-transform-private-methods', { loose: true }],
  ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ['module:react-native-dotenv', {
    moduleName: '@env',
    path: '.env',
    allowUndefined: true,
  }],
  'react-native-reanimated/plugin', // 🔴 must be last
],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};