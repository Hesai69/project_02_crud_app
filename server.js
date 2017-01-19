var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/Geo';
var objectId = require('mongodb').ObjectID;
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
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
// app.set('view engine', 'ejs');

//view engine set-up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
// server .hbs templates from views with res.render
app.set('views', path.join(__dirname, 'views'));
// Use Handlebars syntax {{ }}
app.set('view engine', 'hbs');

// Routes
app.get('/', function(req, res, next) {
  res.render('index', {title: 'Geo Tools'});
});

app.get('/addressCoords', function(req, res, next) {

});

app.post('/save', function(req, res, next) {
  console.log(req);
  var latlng = { lat: req.body.geo.split(',')[0], lng: req.body.geo.split(',')[1] };
  var location = {
    name: req.body.name,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    geo: latlng
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

app.get('/get-data', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var arr = [];
    var result = db.collection('locations').find();
    result.forEach(function(doc) {
      arr.push(doc);
      console.log('locations', doc);
    });
    db.close();
    res.render('index', {title: 'Geo Tools', locations: arr});
  });
});

app.post('/get-data/:id/delete', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var id = req.body.delete;
    db.collection('locations').removeOne({'_id': objectId(id) });
    console.log('Removed document Id: ' + id);
    db.close();
    res.redirect('/get-data');
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on port: " + port);
});
