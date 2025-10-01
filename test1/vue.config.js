const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false, // multi-word 에러 피하는
  transpileDependencies: true,
  outputDir:
    "D:\\TOYCHAT\\workspace\\TOYCHAT\\toychatuser\\src\\main\\resources\\static",
  devServer: {
    port: 9091,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_TARGET_URL,
        changeOrigin: true,
        //pathRewrite: { "^/api": "" }, // 이거 안지우니 405 method 불일치
      },
    },
  },
});
