module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript"
    ],
    plugins: [
        ["module-resolver", {
            alias: {
                "@config": [
                    "./src/config"
                ],
                "@database": [
                    "./src/database"
                ],
                "@modules": [
                    "./src/modules"
                ],
                "@routes": [
                    "./src/routes"
                ],
                "@shared": [
                    "./src/shared"
                ],
                "@utils": [
                    "./src/utils"
                ],
            }
        }],
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],

    ]
}