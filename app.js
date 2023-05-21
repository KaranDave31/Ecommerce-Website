//jshint eversion:6

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();
const app = express();
app.use(express.static("public"));
app.use(express.json()); //accept data in json format
 //to decode data recevived from htmlform
// app.use("/css",express.static("css"));
// app.use('/assets',express.static("assets"));
// app.use('/css',express.static("styles"));
app.use(express.static(__dirname + 'assets'));
app.use(bodyParser.urlencoded({
  extended: false
}));

const connection = mysql.createConnection({
  host : "localhost",
  user: "root",
  password : "MYsql@123#",
  database: "nodejs"
});

connection.connect(function(error){
  if (error)
    throw error
  else
    console.log("Connected to databse ");
})


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/loginpage.html')
  // const userName = req.body.username;
  // const Password = req.body.password;
})

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
// })

// app.post('/', (req, res) => {
//     // console.log(req.body);
// console.log(userName);
// console.log(Password);
// })

app.post("/",  function (req,res){
  var userName = req.body.username;
  var Password = req.body.password;
  console.log(userName,Password);


var query = `
INSERT INTO loginuser
(user_name,user_pass)
VALUES ("${userName}", "${Password}")
`;


connection.query(query, function(error,data){
  if (error){
    throw error
  }
  else
    // console.log("No error in database ");
    res.redirect('/index');
res.end()
})
})
//   connection.query("select * from loginuser where user_name = ? and user_pass = ?",[userName,Password], function(error, results,fields){
//     if (results.length>0){
//       res.redirect("/index");
//     }
//     else{
//       res.redirect("");
//     }
//     res.end()
//
//   })
// })

// app.get("/index",function(req,res){
//   res.sendFile(__dirname + "/index.html");
// })


// starting on port

app.listen(3000, function () {
    console.log("Server running at port 3000 ");
});
