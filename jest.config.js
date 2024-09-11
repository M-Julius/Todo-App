module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-bouncy-checkbox|@react-native|@react-navigation)/)',
  ],
};
