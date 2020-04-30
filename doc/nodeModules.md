# 高质量 node 组件

主要收集一些在开发过程中遇到的业界质量高的 npm 组件

主要分类如下：

- 网络请求
- 文件操作
- 日志
- 异常处理
- 异步编程
- 数据库
- 静态资源
- session / cookie
- 登录
- 进程管理
- 测试
- 断言
- 其他



## 网络请求


`superagent`

https://www.npmjs.com/package/superagent

> SuperAgent is a small progressive client-side HTTP request library, and Node.js module with the same API, sporting many high-level HTTP client features. View the docs.

> TJ 大神神作。用作客户端HTTP请求，Node.js模块也可以使用相同的API。支持高阶的HTTP特性。

***


`request`

https://www.npmjs.com/package/request
> Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.

> 简单的HTTP请求客户端

***

`request-promise`

https://www.npmjs.com/package/request-promise

> The simplified HTTP request client 'request' with Promise support. Powered by Bluebird.

> 简单的HTTP请求客户端 的 promise 版本

***

`whatwg-fetch`

https://www.npmjs.com/package/whatwg-fetch

> window.fetch polyfill

> Github团队佳作。window.fetch polyfill.经常使用在React项目中

***

`compression`

https://www.npmjs.com/package/compression

> Node.js compression middleware.

> 压缩请求中间件，压缩客户端请求资源，让请求响应更快,默认 gzip 压缩

## 文件操作

`fs-extra`

https://www.npmjs.com/package/fs-extra

> fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods. It should be a drop in replacement for fs.

> 扩展了fs，提供了额外的一些

***


`jsonfile`

https://www.npmjs.com/package/jsonfile

> Easily read/write JSON files.

***


## 日志

`log4js`

https://www.npmjs.com/package/log4js

> This is a conversion of the log4js framework to work with node. I've mainly stripped out the browser-specific code and tidied up some of the javascript.

> node 版本的 log4j

***

`morgan`

https://www.npmjs.com/package/morgan

> HTTP request logger middleware for node.js

> HTTP 请求日志中间件,类似 nginx 请求日志

***

## 异常处理

`http-errors`

https://www.npmjs.com/package/http-errors

> Create HTTP errors for Express, Koa, Connect, etc. with ease.
> 处理 400 ~ 500的错误异常。


## 异步编程

`co`

https://www.npmjs.com/package/co

> Generator based control flow goodness for nodejs and the browser, using promises, letting you write non-blocking code in a nice-ish way.

> TJ 大神神作。4.0版本已经兼容ES7 的async/await,不依赖promise了。

`async`

https://www.npmjs.com/package/async

> Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.

***

`bluebird`

https://www.npmjs.com/package/bluebird

> Bluebird is a fully featured promise library with focus on innovative features and performance

> 专注新特性和性能的promise库

***

`eventproxy`

https://www.npmjs.com/package/eventproxy

> 阿里“朴灵”大神的异步解决方案，主要通过“事件”实现异步协作。

***

## 数据库

`connect-redis`

https://www.npmjs.com/package/connect-redis

> connect-redis is a Redis session store backed by node_redis

> 用来连接 redis 数据库。

> 结合 express-session 做用户身份存储。

***

`mongoose`

https://www.npmjs.com/package/mongoose

> Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

> mongodb 连接池中间件。

***

`redis`

https://www.npmjs.com/package/redis

https://github.com/NodeRedis/node_redis

> redis client for node

> redis 官方连接库

***



## 静态资源

`serve-static`

https://www.npmjs.com/package/serve-static

> Serve static files

> 配置静态资源的目录地址

***

`koa-serve-static`

https://www.npmjs.com/package/koa-serve-static

> Serve static files for koa

> 配置静态资源的目录地址（koa版本）

***

## session/cookie

`cookie-parser`

https://www.npmjs.com/package/cookie-parser

> cookie parsing with signatures

> cookie 格式化 中间件

***

## 登录

`passport`

https://www.npmjs.com/package/passport

> Simple, unobtrusive authentication for Node.js.

> 针对Node.js的简单非侵入式认证。提供了相当多的第三方认证机制。

***

## 进程管理

`pm2`

https://www.npmjs.com/package/pm2

> PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

> node 集群 管理神器

***

`nodemon`

https://www.npmjs.com/package/nodemon

> Monitor for any changes in your node.js application and automatically restart the server - perfect for development

> 监听js在开发过程中改变，自动重新reload服务器，而不需要重新启动服务器。

***

## 测试

`eslint`

https://www.npmjs.com/package/eslint

> ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code

> 提供ES5 ~ ES7 javascript 代码检查

***

`mocha`

https://www.npmjs.com/package/mocha

> simple, flexible, fun test framework

> 单元测试

***

`istanbul`

https://www.npmjs.com/package/istanbul

> a JS code coverage tool written in JS

> 覆盖率测试

***

## 断言

`http-assert`

https://www.npmjs.com/package/http-assert

> Assert with status codes. Like ctx.throw() in Koa, but with a guard.


## 其他

`commander`

https://www.npmjs.com/package/commander

> The complete solution for node.js command-line interfaces, inspired by Ruby's commander.

> TJ 大神神作。用来开发Node.js控制台界面应用程序，启发来源于Ruby commander

***

`lodash`

https://www.npmjs.com/package/lodash

> The Lodash library exported as Node.js modules.

> 提供额外的扩展方法

***

`underscore`

https://www.npmjs.com/package/underscore

> Underscore.js is a utility-belt library for JavaScript that provides support for the usual functional suspects (each, map, reduce, filter...) without extending any core JavaScript objects.

> 同 lodash，提供的函数略微有些区别，大体相同。

***


`delegates`

https://www.npmjs.com/package/delegates

> Node method and accessor delegation utilty。

> tj 大神之作，把一个对象上的方法，属性委托到另一个对象上，Koa源码中使用到的。


***

`is-generator-function`

https://www.npmjs.com/package/is-generator-function

> Is this an ES6 generator function?
> 判断函数是否是 ES6的 generator 函数 function* () { yield 42; return Infinity; }