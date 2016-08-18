var mongoose = require('mongoose');
var Item = require('./item');
var itemSchema = Item.schema;

var savedListSchema = new mongoose.Schema({
 name: { type: String, required: true},
 listItems:  [ itemSchema ],
 total: { type: Number },
 current: Boolean
});
var SavedList = mongoose.model('SavedList', savedListSchema);

module.exports = SavedList;
