const keys = require('../config/keys');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: keys.dbUser,
    database: keys.dbName,
    password: dbPass
});

module.exports = pool.promise();