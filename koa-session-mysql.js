const _db = require('mysql-magic');
const _genid = require('./lib/genid');
let _dbname = null;
let _table = null;

// fetch
function retrieveSession(key, maxAge){
    // retrieve connection scope
    return _db.getConnection(_dbname, async function(db){

        // run query - add maxAge in seconds
        const [rows] = await db.query('SELECT `payload` FROM ?? WHERE `session_id` = ? AND `created` > FROM_UNIXTIME(UNIX_TIMESTAMP() - ?) LIMIT 1;', [_table, key, maxAge/1000]);

        // invalid ?
        if (rows.length === 0){
            return null;
        }

        // de-serialize
        return JSON.parse(rows[0].payload);
    });
}

// store
function storeSession(key, sess){
    // retrieve connection scope
    return _db.getConnection(_dbname, function(db){
        // serialize
        const payload = JSON.stringify(sess);

        // upsert
        const query = 'INSERT INTO ?? (session_id, modified, payload) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE session_id=?, modified=?, payload=?';
        
        // modified
        const now = new Date();

        // run query
        return db.query(query, [_table, key, now, payload, key, now, payload]);
    });
}

// drop session
function destroySession(key){
    // retrieve connection scope
    return _db.getConnection(_dbname, async function(db){
        // try to destroy session
        const [result] = await db.query('DELETE FROM ?? WHERE `session_id` = ? LIMIT 1;', [_table, key]);

        // session deleted ?
        return result.affectedRows > 0;
    });
}

function init(dbpool, table){
    // get db pool by name
    _dbname = dbpool;

    // store table name
    _table = table;
}

module.exports = {
    init: init,
    get: retrieveSession,
    set: storeSession,
    destroy: destroySession,
    genid: _genid
}