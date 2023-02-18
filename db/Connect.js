const mysql = require('mysql');
const { use } = require('../routers/routers');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbchat'
});

class database{
    inserir(name, email, pass){
        let img = "https://api.dicebear.com/5.x/initials/svg?seed="+name;
        db.query("INSERT INTO tbusers(users_name, users_email, users_pass, users_img) VALUES('"+name+"', '"+email+"', '"+pass+"', '"+img+"')", (err, result) => {
            if(err) throw err;
            console.log(result);
        })
    }
    logar(user, pass)
    {
        db.query("SELECT * FROM tbusers WHERE users_name = '"+user+"' or users_email = '"+user+"' and users_pass = '"+pass+"';", (err, result) => {
            if(err) throw err;
            console.log(result);
        })
    }
    alterar(name, email, pass, id){
        db.query("UPDATE tbusers SET users_name = '"+name+"', users_email = '"+email+"', users_pass = '"+pass+"' WHERE users_id = '"+id+"' ;")
    }
    deletar(id){
        db.query("DELETE FROM tbusers WHERE users_id = '"+id+"' ;", (err, result) => {
            if(err) throw err;
            console.log(result);
        })
    }

}

db.connect((err) => {
    if(err) throw err;
    console.log("Connected!");
})

module.exports = database