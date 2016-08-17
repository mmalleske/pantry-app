var mongoose = require('mongoose');

var totalSchema = new mongoose.Schema({
 total: { type: Number}
});

var Total = mongoose.model('Total', totalSchema);

module.exports = Total;

