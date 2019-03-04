const mongoose = require('mongoose')
const { Schema } = mongoose;

const urlShortenSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
});

mongoose.model('UrlShorten', urlShortenSchema);
                        