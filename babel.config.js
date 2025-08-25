module.exports = {
    presets: ['@react-native/babel-preset'],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
            },
            'react-native-worklets/plugin',
        ],
    ],
}
