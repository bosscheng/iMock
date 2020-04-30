# 收集 日常用到的 koa 的中间件


## 列表

- koa-bodyparser
- koa-compress
- koa-conditional-get
- koa-csrf
- koa-ejs
- koa-etag
- koa-favicon
- koa-generic-session
- koa-logger
- koa-onerror
- koa-redis
- koa-resource-router
- koa-rewrite
- koa-router
- koa-rt
- koa-safe-jsonp
- koa-session
- koa-static-cache


***

`koa-bodyparser`

https://www.npmjs.com/package/koa-bodyparser

> A body parser for koa, base on co-body. support json, form and text type body.
> 格式话 body 对象，变成 object 对象。

### demo

``` js
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');

var app = new Koa();
app.use(bodyParser());

app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

***


`koa-compress`

https://www.npmjs.com/package/koa-compress

> Compress middleware for Koa
> compress  压缩中间件


### demo
``` js
var compress = require('koa-compress')
var koa = require('koa')

var app = koa()
app.use(compress({
  filter: function (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
```


***


`koa-conditional-get`

https://www.npmjs.com/package/koa-conditional-get

> Conditional GET support for koa.
> 需要结合 etag 一起使用。

### demo

```js
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var koa = require('koa');
var app = koa();

// use it upstream from etag so
// that they are present

app.use(conditional());

// add etags

app.use(etag());

// respond

app.use(function *(next){
  yield next;

  this.body = {
    name: 'tobi',
    species: 'ferret',
    age: 2
  };
})

app.listen(3000);

console.log('listening on port 3000');
```

***


`koa-csrf`

https://www.npmjs.com/package/koa-csrf

> CSRF tokens for Koa >= 2.x (next). For Koa < 2.x (next) see the 2.x branch.

### demo

```js
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import convert from 'koa-convert';

const app = new Koa();

// set the session keys
app.keys = [ 'a', 'b' ];

// add session support
app.use(convert(session()));

// add body parsing
app.use(bodyParser());

// add the CSRF middleware
app.use(new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));

// your middleware here (e.g. parse a form submit)
app.use((ctx, next) => {

  if (![ 'GET', 'POST' ].includes(ctx.method))
    return next();

  if (ctx.method === 'GET') {
    ctx.body = ctx.csrf;
    return;
  }

  ctx.body = 'OK';

});

app.listen();

```

***

`koa-ejs`

https://www.npmjs.com/package/koa-ejs

> Koa ejs view render middleware. support all feature of ejs.
> ejs 的 koa 渲染模板

### demo
```js
const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');

const app = new Koa();
render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.use(async function (ctx) {
  await ctx.render('user');
});

app.listen(7001);
```

***

`koa-etag`

https://www.npmjs.com/package/koa-etag

> ETag support for Koa responses using etag.
> 支持 etag， 需要结合 conditional-get  使用。

### demo
```js
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var koa = require('koa');
var app = koa();

// etag works together with conditional-get
app.use(conditional());
app.use(etag());

app.use(function(ctx) {
  ctx.body = 'Hello World';
});

app.listen(3000);

console.log('listening on port 3000');
```

***

`koa-favicon`

https://www.npmjs.com/package/koa-favicon

> Koa middleware for serving a favicon. Based on serve-favicon.
> 设置 favicon 标题图标的。


### demo

```
var koa = require('koa');
var favicon = require('koa-favicon');
var app = koa();

app.use(favicon(__dirname + '/public/favicon.ico'));
```

***

`koa-generic-session`

https://www.npmjs.com/package/koa-generic-session

> Generic session middleware for koa, easy use with custom stores such as redis or mongo, supports defer session getter.


### demo

```
var session = require('koa-generic-session');
var redisStore = require('koa-redis');
var koa = require('koa');

var app = koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore()
}));

app.use(function *() {
  switch (this.path) {
  case '/get':
    get.call(this);
    break;
  case '/remove':
    remove.call(this);
    break;
  case '/regenerate':
    yield regenerate.call(this);
    break;
  }
});

function get() {
  var session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}

function remove() {
  this.session = null;
  this.body = 0;
}

function *regenerate() {
  get.call(this);
  yield this.regenerateSession();
  get.call(this);
}

app.listen(8080);
```

***

`koa-logger`

https://www.npmjs.com/package/koa-logger

> Development style logger middleware for koa.

### demo

``` js
const logger = require('koa-logger')
const Koa = require('koa')

const app = new Koa()
app.use(logger())
```

***


`koa-onerror`

https://www.npmjs.com/package/koa-onerror

>  an error handler for koa, hack ctx.onerror.different with koa-error:


### demo

```
const fs = require('fs');
const koa = require('koa');
const onerror = require('koa-onerror');

const app = koa();

onerror(app);

app.use(function*(){
  // foo();
  this.body = fs.createReadStream('not exist');
});
```

***

`koa-redis`

https://www.npmjs.com/package/koa-redis

> Redis storage for koa session middleware/cache.
> koa-redis works with koa-generic-session (a generic session middleware for koa).


### demo

```
var session = require('koa-generic-session');
var redisStore = require('koa-redis');
var koa = require('koa');

var app = koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore({
    // Options specified here
  })
}));

app.use(function *() {
  switch (this.path) {
  case '/get':
    get.call(this);
    break;
  case '/remove':
    remove.call(this);
    break;
  case '/regenerate':
    yield regenerate.call(this);
    break;
  }
});

function get() {
  var session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}

function remove() {
  this.session = null;
  this.body = 0;
}

function *regenerate() {
  get.call(this);
  yield this.regenerateSession();
  get.call(this);
}

app.listen(8080);
```

***

`koa-resource-router`

https://www.npmjs.com/package/koa-resource-router

> RESTful resource routing for koa.


### demo

```
 var Resource = require('koa-resource-router');
 var app = require('koa')();

 var users = new Resource('users', {
   // GET /users
   index: function *(next) {
   },
   // GET /users/new
   new: function *(next) {
   },
   // POST /users
   create: function *(next) {
   },
   // GET /users/:id
   show: function *(next) {
   },
   // GET /users/:id/edit
   edit: function *(next) {
   },
   // PUT /users/:id
   update: function *(next) {
   },
   // DELETE /users/:id
   destroy: function *(next) {
   }
 });

 app.use(users.middleware());
```

***

`koa-rewrite`

https://www.npmjs.com/package/koa-rewrite

> URL rewrite middleware for koa.

### demo

``` js
app.use(rewrite(/^\/i(\w+)/, '/items/$1'));
```

***

`koa-router`

https://www.npmjs.com/package/koa-router

> Router middleware for koa

### demo

``` js
var Koa = require('koa');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

router.get('/', function (ctx, next) {
  // ctx.router available
});

app
  .use(router.routes())
  .use(router.allowedMethods());

```

***

`koa-rt`

https://www.npmjs.com/package/koa-rt

> koa rt with microtime

### demo

```
var koa = require('koa');
var rt = require('koa-rt');
var app = koa();

app.use(rt());

app.use(function *(next){
  yield sleep(150);
  this.body = 'Hello';
});

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  };
}

app.listen(7001);

console.log('listening on port 7001');


```

***

`koa-safe-jsonp`

https://www.npmjs.com/package/koa-safe-jsonp

> Safe jsonp plusins for koa.


### demo

```
var jsonp = require('koa-safe-jsonp');
var koa = require('koa');

var app = koa();
jsonp(app, {
  callback: '_callback', // default is 'callback'
  limit: 50, // max callback name string length, default is 512
});

app.use(function* () {
  this.jsonp = {foo: "bar"};
});

app.listen(1984);
```

***

`koa-session`

https://www.npmjs.com/package/koa-session

> Simple session middleware for Koa. default is cookie-based session and support external store.
> Requires Node 7.6 or greater for async/await support

### demo

```
const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

app.use(ctx => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
});

app.listen(3000);
console.log('listening on port 3000');

```

***

`koa-static-cache`

https://www.npmjs.com/package/koa-static-cache

> Static server for koa.

***

### demo

```
var path = require('path')
var staticCache = require('koa-static-cache')

app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60
}))
```


***