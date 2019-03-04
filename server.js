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

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get("/:urlId", function (req, res) {
  const id = req.params.urlId;
  UrlShorten.findById(id)
  .exec()
  .then(doc => {
    console.log(doc)
    res.json({
    tets: doc
  })
  .catch(err => console.log(err));
})
});

app.get('/api/shorturl/', function(req, res){
  UrlShorten.find().exec().then(doc => {
    console.log(doc);
    res.json({message: doc,
             test: 'g'})
  })
});
var shortBaseUrl = 'http://localhost'

app.post("/api/shortirl/new", function(req, res) {
  const originalUrl = req.body.originalUrl;
      const urlCode = shortid.generate();
    const updatedAt = new Date();
  if (validUrl.isUri(originalUrl)) {
      // const item = UrlShorten.findOne({originalUrl: originalUrl}); 
      // if (item) {
      //   res.status(200).json(item)
      // }
      // else {
    shortUrl = shortBaseUrl + "/" + urlCode;
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
    res.json(item)
      }
  else { 
    res.status(401).json('invalid original url')
  }
  });

var shortUrl;




app.post("/api/shorturl/new", async (req, res) => {
    const { originalUrl, shortBaseUrl } = req.body;
  
    const urlCode = shortid.generate();
    const updatedAt = new Date();
    if (validUrl.isUri(originalUrl)) {
      try {
        const item = await UrlShorten.findOne({ originalUrl: originalUrl });
        if (item) {
          res.status(200).json(item);
        } else {
          shortUrl = shortBaseUrl + "/" + urlCode;
          const item = new UrlShorten({
            originalUrl,
            shortUrl,
            urlCode,
            updatedAt
          });
          await item.save();
          res.status(200).json(item);
        }
      } catch (err) {
        res.status(401).json("Invalid User Id");
      }
    } else {
      return res
        .status(401)
        .json(
          "Invalid Original Url"
        );
    }
  });

app.listen(port, function () {
  console.log('Node.js listening ...');
});