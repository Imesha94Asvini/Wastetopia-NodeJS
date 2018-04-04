var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ewm'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log(err);
        console.log("Error connecting database ... nn");
    }
});

exports.getNoOfUsers=function(req,res){
    var query="SELECT COUNT(idCustomer) AS noofcustomers FROM customer ";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}

exports.getAvailableItems=function(req,res){
    var query="SELECT COUNT(idResource) AS noofresources FROM resource";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}

exports.getRequestedItems=function(req,res){
    var query="SELECT COUNT(idRequested_Resource) AS noofreqresource FROM requested_resource ";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}

exports.getNoOfMatches=function(req,res){
    var query="SELECT COUNT(resource.SubCatergory_idSubCatergory AND requested_resource.SubCatergory_idSubCatergory) AS noofmatches FROM resource,requested_resource,customer WHERE resource.SubCatergory_idSubCatergory=requested_resource.SubCatergory_idSubCatergory AND requested_resource.customer_idCustomer=customer.idCustomer";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}

exports.getTopBuyerByCustomerId=function(req,res){   
    var query="SELECT customer.FName FROM customer WHERE customer.idCustomer = (SELECT topbuyer.customer_idCustomer FROM topbuyer WHERE topbuyer.nocount = (SELECT MAX(topbuyer.nocount) FROM topbuyer))";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}

exports.getTopSellerByCustomerId=function(req,res){   
    var query="SELECT FName FROM customer WHERE idCustomer = (SELECT customer_idCustomer FROM resource WHERE idResource=(SELECT resource_idResource FROM topseller WHERE ncount=(SELECT MAX(topseller.ncount) FROM topseller)))";
    connection.query(query,function(err,results){
        if(err)throw err;
         res.send(results);
    
    });
}
