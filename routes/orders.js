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


exports.newOrder = function (req, res) {
    var today = new Date();
    var dateFormat = require('dateformat');
    var odate = dateFormat(today, "yyyy-mm-dd HH:MM:ss");



    //console.log(req.body.order_items);

    var query = "INSERT INTO `order`(`TotalPrice`, `Street_address`, `City`, `Payment_Id`, `customer_idCustomer`, `order_date`) VALUES ('" + req.body.TotalPrice + "','" + req.body.Street_address + "','" + req.body.City + "','" + req.body.Payment_Id + "','" + req.body.customer_idCustomer + "','" + odate + "')";

    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {

            var items = req.body.order_items;
            console.log(items);

            for (var i = 0; i < items.length; i++) {
                var query2 = "INSERT INTO `order_item` VALUES ('" + results.insertId + "','" + items[i].resourceId + "','" + items[i].quantityRequested + "')";
                connection.query(query2, function (error, results, fields) {
                    if (error) {
                        console.log("error ocurred", error);

                    }
                    else {
                        console.log(results);
                    }
                });
            }
            res.send({
                "code": 200,
                "success": true,
                "orderId": results.insertId,
                "msg": "Order placed successfully"
            });
        }
    });


}

exports.newRequest = function (req, res) {
    var today = new Date();
    var dateFormat = require('dateformat');
    var odate = dateFormat(today, "yyyy-mm-dd HH:MM:ss");



    console.log(req.body);

    var query = "INSERT INTO `requested_resource`(`Req_Resource_Name`, `Req_Quantity`, `Description` , `Requested_Date`, `Status`, `SubCatergory_idSubCatergory`,`customer_idCustomer`) VALUES ('" + req.body.Req_Resource_Name + "','" + req.body.Req_Quantity + "','" + req.body.Description + "','" + odate + "','" + req.body.Status + "','" + req.body.SubCatergory_idSubCatergory + "','" + req.body.customer_idCustomer + "')";

    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        }
        else {



            res.send({
                "code": 200,
                "success": true,
                "requestId": results.insertId,
                "msg": "Requested successfully"
            });
        }
    });

}




exports.getOrdersBycustomerId = function (req, res) {
    var Cid = req.body.customerid;
    var query = "SELECT idOrder,TotalPrice,order_date FROM `order` WHERE customer_idCustomer='" + Cid + "'";
    console.log(Cid);
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);

    });
}

exports.getSellingOrdersBycustomerId = function (req, res) {
    var Cid = req.body.customerid;
    var query = "SELECT idResource,ResourceName,order_item_amount FROM resource,order_item WHERE resource.customer_idCustomer='" + Cid + "' AND order_item.resource_idResource=resource.idResource";
    console.log(Cid);
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);

    });
}

exports.getOrderByOrderId = function (req, res) {
    var oid = req.body.orderid;
    var query = "SELECT * FROM `order`,`order_item`,`resource`,`customer` WHERE `order`.`idOrder`=`order_item`.`order_idOrder` AND `order`.`idOrder`=" + oid + " AND `order_item`.`resource_idResource`=`resource`.`idResource` AND `customer`.`idCustomer`=`resource`.`customer_idCustomer`";
    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
}