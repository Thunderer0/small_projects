var nodemailer = require('nodemailer');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
const {
  Console
} = require('console');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/post-feedback', function (req, res) {
  dbConn.then(function (db) {
    var dbo = db.db("ecommercewebsite");
    // delete req.body._id; // for safety reasons
    dbo.collection('feedback form').insertOne(req.body);
  });
  // res.send('Data received:\n' + JSON.stringify(req.body));
  res.sendFile('public/index1.html', {
    root: __dirname
  });
  var halo = req.body.email;
  var balo = req.body.name;
  var calo = req.body.comment
  // var balo = halo.name;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'parilsanghvi@gmail.com',
      pass: 'Paril@0510'
    }
  });

  var mailOptions = {
    from: 'parilsanghvi@gmail.com',
    to: halo,
    subject: 'welcome to ecommerce website helpdesk',
    text: 'your name is: ' + balo + '\nyour comment is: ' + calo + ' \n'+'http://localhost:8080/emailverification',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});
// app.get('/view-feedbacks', function (req, res) {
//   dbConn.then(function (err, db) {
//     if (err) {
//       throw err;
//     }
//     var dbo = db.db("ecommercewebsite");
//     dbo.collection("feedback form").find({}).toArray(function (result, err) {
//       if (err) {
//         throw err;
//       }
//       // console.log(result);
//       function dholu(result) {
//          res.send(JSON.stringify(result))
//       };
//       db.close();
//       dholu()
//     });
//   });
// });
//  var bholu = JSON.stringify(result);
// res.send('Data received:\n' + JSON.stringify(result));
// res.status(200).send(JSON.stringify(result));
// console.log(result)
app.listen(process.env.PORT || 8000, process.env.IP || '0.0.0.0');