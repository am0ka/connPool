var express   =    require("express");
 var mysql     =    require('mysql');
 var app       =    express();

 var pool      =    mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : '',
     database : 'mysql',
     debug    :  false
 });

 function handle_database(req,res) {

     pool.getConnection(function(err,connection){
         if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
         }   

         console.log('connected as id ' + connection.threadId);

         connection.query("select Host, User, authentication_string from user",function(err,rows){
             connection.release();
             if(!err) {
                 res.json(rows);
             }           
         });

         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
   });
 }

 app.get("/connPool",function(req,res){
         handle_database(req,res);
 });

 app.listen(3001);