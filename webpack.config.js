const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: {
        index: "./public/index.js",
        db: "./public/db.js"
    },
    output: {
        path: __dirname + "/public/dist",
        filename: "[name].bundle.js"
    },
    mode: "development",
    plugins: [
        new WebpackPwaManifest({
            filename: "manifest.json",
            fingerprints: false,
            name:  "budget app",
            short_name: "BA",
            description: "track your money on or offline",
            background_color: "#01579b",
            theme_color: "#ffffff",
            "theme-color": "#ffffff",
            start_url: "/",
            icons: [
                {
                    src: path.resolve("public/icons.icon-512x512.png"),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join("assets", "icons")
                }
            ]

        })
    ]
};

module.exports = config