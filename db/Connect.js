const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbchat'
});

db.connect((err) => {
    if(err) throw err;
    console.log("Connected!");
})

module.exports = db