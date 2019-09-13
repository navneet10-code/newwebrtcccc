const config = require('../config.json');
const server = require('./lib/server');

var mysql = require('mysql'); 
var con = mysql.createConnection({ 
host : 'sql12.freemysqlhosting.net',
database : 'sql12304794',
user : 'sql12304794',
password : 'PLSEEGHnWv', 
}); 
con.connect(function(err) { 
if (err) throw err; 
con.query("SELECT * FROM user", function (err, result) { 
if (err) throw err; 
console.log(result); 
}); 
});




config.PORT = process.env.PORT || config.PORT;

server.run(config);



