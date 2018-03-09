koa-session-mysql
=========================================


## Features ##

* Simple mysql based session storage for [koa-session](https://github.com/koajs/session)

## Install ##

```bash
$ npm install koa-session-mysql --save
$ yarn add koa-session-mysql
```

## Usage ##

MySQL Table Layout (required fields)

```sql
CREATE TABLE IF NOT EXISTS `session` (
  `session_id` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `payload` text
) ENGINE=InnoDB;

ALTER TABLE `session` ADD PRIMARY KEY (`session_id`);
```

## Examples ##

```js
const _Koa = require('koa');
const _koaSession = require('koa-session');
const _mysql = require('mysql-magic');
const _koaSessionMysql = require('koa-session-mysql');

// initialize connection pool - koa-session-mysql access it by its name
// somewhere during your applications bootstrap...initialize a custom pool. 
// It consumes any pool-options of [mysqljs](https://github.com/mysqljs/mysql)
_mysql.initPool('koa-session', {
    host     : 'localhost',
    user     : 'dev',
    password : 'dev',
    database : 'koa_test'
});

// set db pool + table for storage
_koaSessionMysql.init('koa-session', 'session');

// new Koa app + keygrip keys
const _webapp = new _Koa();
_webapp.keys = ['1234567890'];

// initialize session middleware
cwebapp.use(_koaSession({
    store: _koaSessionMysql,
    key: 'sid',
    maxAge: 86400000,
}, _webapp));

_webapp.use(ctx => {
    // ignore favicon
    if (ctx.path === '/favicon.ico') return;

    // increase counter
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;

    // show counter
    ctx.body = n + ' views';
});

_webapp.listen(3000);
console.log('listening on port 3000');
```

## License ##
koa-session-mysql is OpenSource and licensed under the Terms of [The MIT License (X11)](http://opensource.org/licenses/MIT) - your're welcome to contribute