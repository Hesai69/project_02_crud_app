var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/gps';
var logger = require('morgan');
var path = require('path');
var hbs = require('express-handlebars');

var app = express();
//require routes
//var routes = require('./routes/index');

// Middleware
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
// app.set('view engine', 'ejs');

//view engine set-up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
// server .hbs templates from views with res.render
app.set('views', path.join(__dirname, 'views'));
// Use Handlebars syntax {{ }}
app.set('view engine', 'hbs');

// Routes
app.get('/', function(req, res) {
  res.render('index', {title: 'Where Am I?'});
});

// save a location to db
app.post('/save', function(req, res) {
  var location = {
    name: req.params.name,
    street: req.params.street,
    city: req.params.city,
    state: req.params.state
  };
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('locations').insertOne(location, function(err, result) {
      if (err) throw err;
      console.log('Location saved to database');
      db.close();
      res.redirect('/');
    });
  });
});

// app.get('/', function(req, res) {
//   mongo.connect(url, function(err, db) {
//     db.collection('posts').find({}).toArray(function(err, docs) {
//       db.close();
//       res.json({posts: docs});
//     });
//   });
// });

/////////////

// /* CREATE Data */
// router.post('/insert', function(req, res, next) {
//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   };

//   mongo.connect(url, function(err, db) {
//     assert.equal(null, err);
//     db.collection('data').insertOne(item, function(err, result) {
//       assert.equal(null, err);
//       console.log('Item inserted');
//       db.close();
//     });
//   });

//   res.redirect('/');
// });

/* READ Data */


// router.get('/data', function(req, res) {
//   mongo.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log('connected to db');
//     db.collection('data').find().toArray(function(err, result) {
//       db.close();
//       res.send(JSON.stringify(result));
//     });
//   });
// });



// router.get('/data/:id', function(req, res) {
//   mongo.connect(url, function(err, db) {
//     assert.equal(null, err);
//     db.collection('data').findOne({ _id: objectId(req.params.id)}, function(err, result) {
//       db.close();
//       res.send(result);
//     });
//   });
// });


var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on port: " + port);
});
