var mysql      = require('mysql');

var bcript = require('bcryptjs');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'ewm'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});



exports.register = function(req,res){
    // console.log("req",req.body);
    var today = new Date();
    bcript.genSalt(10,function(err,salt){

      bcript.hash(req.body.Password,salt,function(err,hash){
        if(err){

          console.log('error in encript password');
        }
        var customer={
          "FName":req.body.FName,
          "LName":req.body.LName,
          "Username":req.body.Username,
          "Password":hash,
          "Contactno":req.body.Contactno,
          "Company_Name":req.body.Company_Name,
          "Street_address":req.body.Street_address,
          "City":req.body.City,
          "updated_at":today,
          "created_at":today
        }

        
    connection.query('INSERT INTO customer SET ?',customer, function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is: ', results);
        res.send({
          "code":200,
          "success":"user registered sucessfully"
            });
      }
      });

      });

    })
 

  }

  exports.updateUserDetails = function (req, res) {

    console.log(req.body);
    var fname = req.body.FName;
    var lname = req.body.LName;
    var contactno = req.body.Contactno;
    var street = req.body.Street_address;
    var city = req.body.City;
    var Cid = req.body.customerid;
    console.log(fname);
    var query = "UPDATE customer SET FName='" + fname + "', LName='" + lname + "', Contactno='" + contactno + "', Street_address='" + street + "', City='" + city + "' WHERE customer.idCustomer='"+Cid+"'";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
}




exports.updateUserPassword = function (req, res) {

  console.log(req.body);
  bcript.genSalt(10,function(err,salt){
  bcript.hash(req.body.Password,salt,function(err,hash){
    if(err){

      console.log('error in encript password');
    }
    var Cid = req.body.customerid;
     var password=hash;
     

  
  
  var query = "UPDATE customer SET Password='" + password + "' WHERE customer.idCustomer='"+Cid+"'";
  connection.query(query, function (err, results) {
      if (err) throw err;
      res.send(results);
  });
})
  })
}

  exports.login = function(req,res){
      console.log(req.body);
    var username= req.body.Username;
    var password = req.body.Password;
    connection.query('SELECT * FROM customer WHERE Username = ?',[username], function (error, results, fields) {
    if (error) {
      console.log(error);
      res.send({
        "code":400,
        "success":false,
        "msg":"Error occured"
      })
    }else{
      
      if(results.length >0){
        console.log(results[0].Password);
        bcript.compare(password, results[0].Password, function(err, isMatch) {
          if(isMatch) {
           console.log("dead");// Passwords match
           res.send({
            "code":200,
            "success":true,
            "msg":"Login sucessfull",
            "user":results[0]
              });
          } else {
            res.send({
              "code":204,
              "success":false,
              "msg":"Email and password does not match"
                });
           console.log("deaaaaaaaaaaaad");// Passwords don't match
          } 
        });
      }
      else{
        res.send({
          "code":204,
          "success":false,
          "msg":"Email does not exist"
            });
      }
    }
    });
  }