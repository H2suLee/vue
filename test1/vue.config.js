const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "D:/TOYCHAT/workspace/toychatuser/src/main/resources/static",
  devServer: {
    port: 9091,
    proxy: {
      "/api": {
        target: "http://localhost:9090", // 백엔드 서버의 주소로 변경
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
