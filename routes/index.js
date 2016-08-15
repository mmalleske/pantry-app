var express = require('express');
var router = express.Router();
var Item = require('../models/item');
var SavedList = require('../models/saved-list');

//GET
router.get('/', function(req, res, next) {
  Item.find({}, function(err, items){
    if (err) console.log(err);
    res.render('index', { title: 'Pantry', items: items });
  })
});
//NEW
router.get('/new', function(req, res, next) {
  //create new item form
  res.render('new', { title: 'Pantry' });
});
//SHOW
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  Item.findOne({_id: id }, function(err, item){
    if (err) console.log(err);
    res.render('show', {title: 'Item', item: item})
  })
});
//EDIT
router.get('/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Item.findOne({_id: id }, function(err, item){
    if (err) console.log(err);
    res.render('edit', {title: 'Pantry', item: item})
  })
});

//CREATE
router.post('/', function(req, res, next){
  // create a item then redirect to index
  var newItem = new Item({
    name: req.body.name,
    price: req.body.price
  });
  newItem.save(function(err, item){
    if (err) console.log(err);
    res.redirect('/');
  });
});
//UPDATE
router.patch('/:id', function(req, res, next) {
  Item.findByIdAndUpdate(req.params.id, req.body, function(err, item){
    if (err) console.log(err);
    res.redirect('/');
  })
});
//DELETE
router.delete('/:id', function(req, res, next){
  // delete specific item and redirect back to index
  Item.findByIdAndRemove(req.params.id, req.body, function(err, item){
    if (err) console.log(err);
    res.redirect('/');
  })
});


module.exports = router;
