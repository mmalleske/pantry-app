var mongoose = require('mongoose');

var searchItemSchema = new mongoose.Schema({
 name: { type: String, required: true},
 price: { type: Number},
 image: { type: String},
 largeImage: { type: String }
 // tracking: {type: Boolean },
});
var SearchItem = mongoose.model('SearchItem', searchItemSchema);


module.exports = SearchItem;
