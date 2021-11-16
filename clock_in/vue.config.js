module.exports = {
    pages: {
        index: {
            // 入口
            entry: 'src/main.js',
        },
    },
    lintOnSave: false, //关闭语法检查 
    // 开启代理服务器
    devServer: {
        proxy: `http://42.193.15.69:8181`
    },
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 直接覆盖变量
                        'text-color': '#111',
                        'border-color': '#eee',
                        // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                        hack: `true; @import "C:\Users\hongyang\Desktop\clear_plate\src\assets\css\fileUp.less";`,
                    },
                },
            },
        },
    },
    outputDir: 'dist',
    publicPath: process.env.NODE_ENV === 'production' ? '/vant-demo/' : '/',
    publicPath: "./",
    assetsDir: "static",
    outputDir: 'dist',

}