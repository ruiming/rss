## RSS 订阅器

Web 桌面版基于 Angular1, Bootstrap, D3, Sass, Gulp 等开发

![image](https://raw.githubusercontent.com/ruiming/rss/master/public/img/preview.png)


Web 手机版基于 Vue2, Vuex, Vue-router, Underscore, PostCSS, Webpack2 等开发

![image](https://raw.githubusercontent.com/ruiming/rss/master/public/img/preview2.png)


后端为基于 Koa2 的 RESTful API. 数据库使用了 MongoDB, 使用 JWT 进行鉴权. 使用 PM2 进行线上部署


### 演示

目前网站已经上线 [www.enjoyrss.com](https://www.enjoyrss.com/)


### 使用

- 安装依赖

  ```
  npm install
  npm run build
  ```

- 运行数据库（根据情况修改 package.json 中的数据库路径）

  ```
  npm run devdb
  ```

- 运行开发环境

  ```
  npm run dev
  ```

- 访问

  输入 [127.0.0.1:3000](http://127.0.0.1:3000) 访问即可

