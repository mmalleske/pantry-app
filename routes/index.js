var express = require('express');
var router = express.Router();
var Item = require('../models/item');
var SavedList = require('../models/saved-list');

//GET Current List
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
//GET Saved Lists
router.get('/saved-lists', function(req, res, next) {
  SavedList.find({}, function(err, savedLists){
    if (err) console.log(err);
    res.render('saved-lists', { title: 'Saved Lists', savedLists: savedLists });
  })
});
//Get Individual List
router.get('/saved-lists/:id', function(req, res, next) {
  var id = req.params.id;
  SavedList.findOne({_id: id }, function(err, savedList){
    if (err) console.log(err);
    res.render('saved-list', { title: 'Saved List', savedList: savedList });
  })
});

//SHOW
// router.get('/:id', function(req, res, next) {
//   var id = req.params.id;
//   Item.findOne({_id: id }, function(err, item){
//     if (err) console.log(err);
//     res.render('show', {title: 'Item', item: item})
//   })
// });
//EDIT
router.get('/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Item.findOne({_id: id }, function(err, item){
    if (err) console.log(err);
    res.render('edit', {title: 'Pantry', item: item})
  })
});
//CREATE NEW SAVED LIST
router.post('/saved-lists/', function(req, res, next){
  // create a item then redirect to index
  var newSavedList = new SavedList({
    name: req.body.name
  });
  newSavedList.save(function(err, savedList){
    if (err) console.log(err);
    res.redirect('/saved-lists');
  });
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
//DELETE LIST
router.delete('/saved-lists/:id', function(req, res, next){
  // delete specific item and redirect back to index
  SavedList.findByIdAndRemove(req.params.id, req.body, function(err, item){
    if (err) console.log(err);
    res.redirect('/saved-lists');
  })
});
//DELETE ITEM
router.delete('/:id', function(req, res, next){
  // delete specific item and redirect back to index
  Item.findByIdAndRemove(req.params.id, req.body, function(err, item){
    if (err) console.log(err);
    res.redirect('/');
  })
});



module.exports = router;
