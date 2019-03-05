'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var validUrl = require('valid-url');
var shortid = require('shortid');
var cors = require('cors');

// const UrlShorten = require('./urlShorten');

const urlShortenSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
});

var UrlShorten = mongoose.model('UrlShorten', urlShortenSchema);

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/:code", async (req, res) => {
const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.json('error');
    }
  });

app.get('/api/shorturl/', function(req, res){
  UrlShorten.find().exec().then(doc => {
    console.log(doc);
    res.json(doc)
  })
});
var shortBaseUrl = 'https://jagged-dirt.glitch.me'

app.post("/api/shorturl/new", async (req, res) => {
    const { originalUrl } = req.body;
    const urlCode = shortid.generate();
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      return res
        .status(401)
        .json(
          "Invalid Base Url"
        );
    }
   
  if (validUrl.isUri(originalUrl)) {
    try {
      const item = await UrlShorten.findOne({originalUrl: originalUrl}); 
      if (item) {
        res.status(200).json(item)
      }
      else {
    var shortUrl = shortBaseUrl + "/" + urlCode;
  const item = UrlShorten({
    _id: new mongoose.Types.ObjectId(),
    originalUrl,
    shortUrl,
    urlCode,
  });
  item.save(function(err, data) {
    if (err) {
      console.log('error saving data')
      res.json('error saving data')
    } else {
      console.log(data)
    }
  });
    res.status(200).json(item)
      }
    } catch (err) {
      res.status(401).json('invalid userID')
    } 
  } else { 
    res.status(401).json('invalid original url')
  }
  });


app.listen(port, function () {
  console.log('Node.js listening ...');
});