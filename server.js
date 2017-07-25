//require packages
var express = require('express');
var app = express();
var fs = require('fs');

//setup directories for server access
app.use(express.static('public'));
app.use(express.static('node_modules'));

/**************************************************************************************************************/

var mysql = require('mysql');

  var connect = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'6470464',
    database:'bmiDB'
  });

/**************************************************************************************************************/

//load website
app.get('/', function(req, res){
  res.send("public/index.html");
  res.end();
});

//save data to files
app.get('/bmi', function(req, res){
  var person = req.query;
  var bmi = bmiCalc(person);

  if(person.weight > 0 && person.height > 0){
      if(person.bmi < 18.5){
        res.send(JSON.stringify("your bmi is "+ person.bmi + " and you're underweight"));
      }
      if(person.bmi > 18.5 && bmi < 25){
        res.send(JSON.stringify("your bmi is "+ person.bmi + " and you're just perfect"));
      }
      if (person.bmi > 25) {
        res.send(JSON.stringify("your bmi is "+ person.bmi + " and you're overweight"));
      }
  } else {
    alert("cant calculate bmi")
  }

  var newFile = fs.writeFile("/home/einar/Desktop/einar/web/be/node/projects/bmi/users/" + person.firstname + '.txt', JSON.stringify(person), function(err){
      if(err) {
        return console.log(err);
      }
      console.log("file was written successfully");
      return;
  });

/**************************************************************************************************************/

connect.connect(function(err){
    if(err) throw err;
    //push data
    var send = 'INSERT INTO userBmi (firstname,lastname,weight,height,age) VALUES ("' + person.firstname + '","' + person.lastname + '",' + person.weight + ',' + person.height + ',' + person.age + ');'
    connect.query(send, function(err){
      if(err)throw err;
    })
    //pull data
    connect.query("SELECT * FROM userBmi", function(err, result, fields){
      if(err)throw err;
      console.log(result);
    })
  });

  res.end();
});

/**************************************************************************************************************/

function bmiCalc(person){
    var bmi = (person.weight / (person.height/100 * person.height/100)).toFixed(2);
    person.bmi = bmi;
    return person;
};

/**************************************************************************************************************/
app.listen(3000, function(){
  console.log("rockenroll 3000");
});
