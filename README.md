# vite.config.js 配置

```javascript
import Vue from '@vitejs/plugin-vue'
import MultiplePages from '@xaios/vite-plugin-multiple-pages'

const CONFIG = {
  // html: 'index.html',   // 自定义全局页面模板路径，路径相对此文件，可以不传，格式参考请看下文
  // icon: 'favicon.ico',  // 自定义全局页面图标，值直接填入，默认值为空
  list: [{
    // html: '',           // 自定义私有页面模板路径，一般不需要配置
    // icon: '',           // 自定义私有页面图标，一般不需要配置
    name: 'main',          // 页面名称，将根据此配置寻找入口与生成页面
    title: 'main',         // 页面标题，为空则取 name 值，也可以在代码中通过 document.title 动态更新
    // entry: 'index.js'   // 自定义页面入口文件，值直接填入，默认填充规则为：`/src/pages/${name}/index.js`
  }]
}

// 也可以直接作为数组传入，此时视为直接传入 list 的内容
// const CONFIG = [{ name: 'main', title: 'main' }]

export default {
  plugins: [Vue(), MultiplePages(CONFIG)]
}
```

# HTML 模板示例

```html
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <link type='image/x-icon' rel='shortcut icon' href='<%= ICON %>' />
    <title><%= TITLE %></title>
  </head>

  <body>
    <div id='app'></div>
  </body>

  <script type='module' src='<%= SRC %>'></script>
</html>
```

# 开发目录要求

- src
  - pages
    - main
      - index.vue
      - index.js，默认根据传入的配置读取对应目录下的 index.js 作为入口
    - user
      - index.vue
      - index.js
- template，临时入口模板目录，程序会自动覆盖此目录，需要注意
- vite.config.js

# 环境要求

Vite3 必须使用 Node.js 14.18+ 或 16+ 的版本，15 及更旧的版本已不被支持，会无法安装。

插件基于 Vite3 + Node.js 16.16.0 开发，所以建议的使用环境也是这样，能确保正常运行，更新的版本可能会在后续兼容。

如果开发环境不允许更新全局 Node.js 版本，可以在项目中安装 Node.js 以实现指定版本运行项目：`npm i node@16.16.0`。
