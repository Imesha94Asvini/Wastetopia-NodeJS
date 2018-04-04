var mysql = require('mysql');
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');

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
        console.log("Error connecting database ... nn");
    }
});



exports.getResourceList = function (req, res) {
    var query = "SELECT idResource,ResourceName,Image,Quantity,UnitPrice,resource.Description,subcatergory.SubCatName,catergory.CatergoryName,customer.Company_Name  FROM resource,customer,subcatergory,catergory WHERE resource.customer_idCustomer=customer.idCustomer AND resource.SubCatergory_idSubCatergory=subcatergory.idSubCatergory AND subcatergory.Catergory_idCatergory=catergory.idCatergory";
    console.log("fc");
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });


}

exports.getResourceById = function (req, res) {
    var query = "SELECT idResource,ResourceName,Image,Quantity,UnitPrice,resource.Description,subcatergory.SubCatName,catergory.CatergoryName,customer.Company_Name  FROM resource,customer,subcatergory,catergory WHERE resource.customer_idCustomer=customer.idCustomer AND resource.SubCatergory_idSubCatergory=subcatergory.idSubCatergory AND subcatergory.Catergory_idCatergory=catergory.idCatergory AND resource.idResource='" + req.body.resourceId + "'";
    console.log("fc");
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });

}

exports.getReqResources = function (req, res) {
    console.log("called");
    var query = "SELECT FName,LName,Req_Resource_Name,Req_Quantity,requested_resource.Description,SubCatName,idRequested_Resource FROM `requested_resource`,`subcatergory`,`customer` WHERE requested_resource.SubCatergory_idSubCatergory=subcatergory.idSubCatergory AND requested_resource.customer_idCustomer=customer.idCustomer";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });

}

exports.getCategories = function (req, res) {
    console.log("called cat");
    var query = "SELECT CatergoryName,idCatergory FROM catergory";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });

}

exports.getSubCategories = function (req, res) {
    var cat = req.body.cat;
    console.log(cat);
    var query = "SELECT SubCatName,idSubCatergory FROM subcatergory,catergory WHERE subcatergory.Catergory_idCatergory=catergory.idCatergory AND catergory.CatergoryName='" + req.body.cat + "'";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });

}

exports.getResourcesBycustomerId = function (req, res) {
    var Cid = req.body.customerid;
    var query = "SELECT idResource,ResourceName,Quantity,UnitPrice,customer_idCustomer,Added_Date FROM resource WHERE resource.customer_idCustomer='" + Cid + "'";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);

    });

}

exports.getRequestedResourcesBycustomerId = function (req, res) {
    var Cid = req.body.customerid;
    var query = "SELECT idRequested_Resource,Req_Resource_Name,Req_Quantity,Requested_Date FROM requested_resource WHERE requested_resource.customer_idCustomer='" + Cid + "'";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);

    });
}

exports.newResource = function (req, res) {


    console.log(req.body);

    var query = "INSERT INTO `resource`(`ResourceName`, `Quantity`, `UnitPrice`, `Description`,`SubCatergory_idSubCatergory`,`customer_idCustomer`) VALUES ('" + req.body.ResourceName + "','" + req.body.Quantity + "','" + req.body.UnitPrice + "','" + req.body.Description + "','" + req.body.SubCatergory_idSubCatergory + "','" + req.body.customer_idCustomer + "')";

    var query2 = "SELECT * FROM `requested_resource`,`customer` WHERE `customer`.`idCustomer`=`requested_resource`.`customer_idCustomer` AND `SubCatergory_idSubCatergory`=" + req.body.SubCatergory_idSubCatergory;
    var to = "";
    connection.query(query2, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
        }
        else {

            if (results.length > 0) {

                for (var i = 0; i < results.length; i++) {
                    console.log("f");
                    to += results[i]['Username'] + ",";
                }
                console.log(to);

            }
        }
    });
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        }
        else {

            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'wastetopia1@gmail.com',
                    pass: 'thefive1234'
                }
            });

            var mailOptions = {
                from: 'wastetopia1@gmail.com',
                to: to,
                subject: 'There is a sucess Match',
                text: 'You got a sucess match with that you have requested item. http://localhost:4200/resource/' + results.insertId
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.send({
                "code": 200,
                "success": true,
                "idResource": results.insertId,
                "msg": "Added successfully"
            });
        }
    });

}

exports.updateAvailableQuantity = function (req, res) {
    var AQ = req.body.availableQuantity;
    var Rid = req.body.idResource;
    var query = "UPDATE resource SET Quantity='" + AQ + "' WHERE resource.idResource='" + Rid + "'";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
}

exports.uploadImage = function(req,res){
    var path = '';
     upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }  
       // No error occured.
        path = req.file.path;
        var imgPath=path.split('\\');
        console.log(imgPath[1]);
        var Rid = req.body.resourceId;
        var query="UPDATE resource SET Image='"+imgPath[1]+"' WHERE resource.idResource='"+ Rid + "'";
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
            }
            else {
                console.log("Img saved in database");
            }
        });
        //console.log(req.body);
        return res.send("Upload Completed for "+path); 
  });     
}