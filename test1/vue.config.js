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
        target: "http://localhost:9090", // 백엔드 서버의 주소로 변경
        //target: "https://oral-therine-heesu-f4935ad1.koyeb.app", // 백엔드 서버의 주소로 변경
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
