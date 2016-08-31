var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var router = express.Router();
var Item = require('../models/item');
var Total = require('../models/total');
var SavedList = require('../models/saved-list');
var SearchItem = require('../models/search-item');
var newSearch = [];


//Get Home
router.get('/', function(req, res, next){
  res.render('index', { title: 'Pantry' });
});
//Get Api Page
router.get('/api', function(req, res, next){
  SearchItem.find({}, function(err, newSearchItem){
    if (err) console.log(err);
    res.render('api', { title: 'Pantry', newSearch: newSearch  });
  })
  console.log("This is the query: " + req.query.items);
  //res.render('api', { title: 'Pantry', newSearchItem: newSearchItem  });
});
//SEARCH API
router.post('/api/', function(req, res, next){
  var searchTerm = req.body.name;
  function reqApi (url){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    return xhr.responseText;
  }
  var json_obj = JSON.parse(reqApi("http://api.walmartlabs.com/v1/search?query=" + searchTerm + "&format=json&facet=on&apiKey=ur7cd9rbm7bxg5astk8q4ufu"));
  newSearch.length = 0;
  SearchItem.remove({}, function(err) {
    if (err) {console.log(err)};
  });
  for (var i = 1; i < json_obj.items.length; i++){
    newSearchItem = new SearchItem({
      name: json_obj.items[i].name,
      price: json_obj.items[i].salePrice,
      image: json_obj.items[i].thumbnailImage
    });
    newSearchItem.save();
    newSearch.push(newSearchItem);
  }
  console.log(newSearch);
  res.redirect('/api/');
});
//post search item to current list
router.post('/api/add-search/:id', function(req, res, next){
  console.log("Can I print an id of :" + req.body);
  SavedList.findOne({current: true}, function (err, currentList){
    if (err) console.log(err);
    var newItem = new Item({
      name: newSearch[i].name,
      price: newSearch[i].price
    });
    currentList.listItems.push(newItem);
    currentList.total += newItem.price;
    currentList.save(function(err, item){
       res.redirect('/saved-lists/current');
     });
  })
});
//GET Current List
router.get('/saved-lists/current', function(req, res, next) {
  SavedList.findOne({current: true}, function(err, savedList){
    if (err) console.log (err);
    res.redirect('/saved-lists/' + savedList._id);
  })
});

//GET Saved Lists
router.get('/saved-lists', function(req, res, next) {
  SavedList.find({}, function(err, savedLists){
    if (err) console.log(err);
    res.render('saved-lists', { title: 'Saved Lists', savedLists: savedLists });
  })
});

//CREATE NEW SAVED LIST
router.post('/saved-lists/', function(req, res, next){
  // create a item then redirect to index
  var newSavedList = new SavedList({
    name: req.body.name,
    total: 0,
    current: false
  });
  newSavedList.save(function(err, savedList){
    if (err) console.log(err);
    res.redirect('/saved-lists');
  });
});
//Get Individual List
router.get('/saved-lists/:id', function(req, res, next) {
  var id = req.params.id;
  SavedList.findOne({_id: id }, function(err, savedList){
    if (err) console.log(err);
    res.render('saved-list', { savedList: savedList });
  })
});

//GET LIST ITEM
router.get('/saved-lists/:saved_list_id/list_items/:list_item_id/edit', function(req, res, next){
  var savedListId = req.params.saved_list_id;
  var listItemId = req.params.list_item_id;
  SavedList.findById(savedListId, function (err, savedList){
    if (err) console.log(err);
    console.log(savedList);
    var item = savedList.listItems.id(listItemId);
    res.render('edit', {title: 'Pantry', savedList: savedList, item: item})
  })
})

//CREATE Saved List Item
router.post('/saved-lists/:id', function(req, res, next){
  // create a item then redirect to index
  var newItem = new Item({
    name: req.body.name,
    price: parseFloat(req.body.price)
  })
  // newItem.save(function(err, item){
  //   if (err) console.log(err);
  // })
  SavedList.findById(req.params.id, function (err, savedList){
    if (err) console.log(err);
    savedList.listItems.push(newItem);
    savedList.total += newItem.price;
    savedList.save(res.redirect('/saved-lists/' + req.params.id));
  })
});



//POST SAVED LIST ITEMS TO CURRENT LIST
router.post('/saved-lists/:id/add', function(req, res, next){
  console.log("Hello World!");
  SavedList.findById(req.params.id, function (err, savedList){
    if (err) console.log(err);
    SavedList.findOne({current: true}, function (err, currentList){
      if (err) console.log(err);
      for (var i = 0; i < savedList.listItems.length; i++){
        var newItem = new Item({
          name: savedList.listItems[i].name,
          price: savedList.listItems[i].price
        });
        currentList.listItems.push(newItem);
        currentList.total += newItem.price;
      }
      currentList.save(function(err, item){
         res.redirect('/saved-lists/current');
       });
    })
  })
});


//UPDATE LIST ITEM
router.patch('/saved-lists/:saved_list_id/list_items/:list_item_id/', function(req, res, next) {
  var savedListId = req.params.saved_list_id;
  var listItemId = req.params.list_item_id;
  SavedList.findById(savedListId, function(err, savedList){
    if (err) console.log(err);
    var item = savedList.listItems.id(listItemId);
    savedList.total -= item.price;
    item.name = req.body.name;
    item.price = req.body.price;
    savedList.total += item.price;
    savedList.save();
    res.redirect('/saved-lists/' + savedListId);
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
//DELETE LIST ITEM
router.delete('/saved-lists/:saved_list_id/list_items/:list_item_id/', function(req, res, next) {
  console.log('delete');
  var savedListId = req.params.saved_list_id;
  var listItemId = req.params.list_item_id;
  SavedList.findById(savedListId, function(err, savedList){
    if (err) console.log(err);
    var item = savedList.listItems.id(listItemId);
    Number((item.price).toFixed(2));
    savedList.total -= item.price;
    Number(Math.round(savedList.total+'e'+2)+'e-'+2);
    item.remove();
    savedList.save();
    //res.redirect('/saved-lists/' + savedListId);
    res.redirect('/saved-lists/' + savedListId);
  })
});



module.exports = router;
