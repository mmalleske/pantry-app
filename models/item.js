var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
 name: { type: String, required: true},
 price: { type: Number}
 // tracking: {type: Boolean },
});
var Item = mongoose.model('Item', itemSchema);
// var SavedItem = mongoose.model('SavedItem', itemSchema);

module.exports = Item;
// module.exports = SavedItem;
