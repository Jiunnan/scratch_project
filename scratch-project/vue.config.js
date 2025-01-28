const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production"
    ? "/vue3_test/" // 將 'repository-name' 替換為你的 GitHub 儲存庫名稱
    : "/",
})
