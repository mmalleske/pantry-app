var mongoose = require('mongoose');

var savedListSchema = new mongoose.Schema({
 name: { type: String, required: true},
 listItems:  [ ],
 total: { type: Number }
});
var SavedList = mongoose.model('SavedList', savedListSchema);

module.exports = SavedList;
