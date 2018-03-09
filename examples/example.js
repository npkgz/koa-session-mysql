const _Koa = require('koa');
const _koaSession = require('koa-session');
const _mysql = require('mysql-magic');
const _koaSessionMysql = require('../koa-session-mysql');

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

const CONFIG = {
    store: _koaSessionMysql,
    key: 'sid',
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

_webapp.use(_koaSession(CONFIG, _webapp));

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

