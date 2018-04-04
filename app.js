const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

var multer = require('multer');
//const passport = require('passport');

//const config = require('./config/database');

var mysql = require('mysql');


const fs = require('fs');




const app = express();



//const users = require('./routes/users');
const resources = require('./routes/resources');
const login = require('./routes/loginroutes');
const orders = require('./routes/orders');
const reports = require('./routes/reports');
// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware


// Body Parser Middleware
app.use(bodyParser.json());

var DIR = './uploads/';
const UPLOAD_PATH = path.resolve(__dirname, '/uploads');
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({ dest: DIR }).single('photo');


// Passport Middleware
//app.use(passport.initialize());
//app.use(passport.session());

//require('./config/passport')(passport);

//app.use('/users', users);
//app.use('/resources', resources);
// Index Route

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var router = express.Router();

router.get('/image/:id', (req, res, next) => {
    //res.send("dasdasda");
    var pathr="./uploads/"+req.params.id;
    res.sendfile(path.resolve(pathr));
  
})

router.get('/resourceList', resources.getResourceList);
router.get('/requestedList', resources.getReqResources);
router.get('/getCategories', resources.getCategories);
router.post('/getsubcategories', resources.getSubCategories);
router.post('/getresourcebyid', resources.getResourceById);
router.post('/getresourcesbyCustomerid', resources.getResourcesBycustomerId);
router.post('/getrequestedresourcesbyCustomerid', resources.getRequestedResourcesBycustomerId);
router.post('/getordersbyCustomerid', orders.getOrdersBycustomerId);
router.post('/getsellingordersbyCustomerid', orders.getSellingOrdersBycustomerId);
router.post('/getorderbyorderid', orders.getOrderByOrderId);
router.post('/updateAvailableQuantity', resources.updateAvailableQuantity);
router.post('/uploadimg',resources.uploadImage)


app.post('/uploadimage', function (req, res) {
  console.log("sadasdsadasd");
  upload(req, res, function (err) {
    if (err) {
      return res.end(err.toString());
    }

    res.end('File is uploaded');
  });
});

app.post('/img', function (req, res) {
  var path = '';
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured")
    }
    // No error occured.
    path = req.file.path;
    return res.send("Upload Completed for " + path);
  });
});

router.post('/neworder', orders.newOrder);
router.post('/newrequest', orders.newRequest);
router.post('/newresource', resources.newResource);

router.post('/getnoofusers', reports.getNoOfUsers);
router.post('/getavailableitems', reports.getAvailableItems);
router.post('/getrequesteditems', reports.getRequestedItems);
router.post('/getnoofmatches', reports.getNoOfMatches);
router.post('/gettopbuyer', reports.getTopBuyerByCustomerId);
router.post('/gettopseller', reports.getTopSellerByCustomerId);

router.post('/register', login.register);
router.post('/login', login.login);
router.post('/updateuserdetails',login.updateUserDetails);
router.post('/updateuserpassword',login.updateUserPassword);
app.use('/api', router);

// Start Server
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
