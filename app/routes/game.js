'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');  //importing node module
var treeHelper = require('../lib/tree-helper');  //importing a file that I wrote; treehelper is an object with property 'getClass'
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

//try and find bob; if he doesn't exist create him, otherwise return the object that already exists - use the findOne method

  users.findOne({username:user.username}, (err,fobj)=>{
    if(fobj){
      res.send(fobj);  //if the object was found, send it to back to the browser; fobj - found object
    }else{
      users.save(user, (e, sobj)=>res.send(sobj));   //if the object is not found, save it to the database; sobj - saved object
    }
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (e, obj)=>{
    res.render('game/tree', {tree: obj, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
  //sends back html for one tree
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);  //converts the string to an Object ID; userId comes from the routes page
  trees.find({userId:userId}).toArray((e, objs)=>{
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (e, html)=>{ //function that gets called when it's finished rendering; (e, html) sends the html back to javascript
      res.send(html);  //sends the html back to the browser
    });
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId}, (e, tree)=>{
    tree.height += _.random(0, 2);  //takes the height of the tree and adds a random value to it
    tree.isHealthy = _.random(0, 100) !== 70;
    trees.save(tree, (e, count)=>{  //if the object has an id already, it will simply update it; it will give you back the count of the thing you updated
      res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{ //function that gets called when it's finished rendering; (e, html) sends the html back to javascript
        res.send(html);  //sends the html back to the browser
      });
    });
  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id: treeId}, (e, tree)=>{
    users.findOne({_id: tree.userId}, (e, user)=>{
      user.wood += tree.height / 2;  //changed one of the value of users, and then saved it again in the database
      users.save(user, ()=>{});
      tree.height = -1;
      trees.save(tree, ()=>{
        res.render('game/tree', {tree:tree, treeHelper: treeHelper}, (e, html)=>{
          res.send({user:user, treeHTML: html});
        });
      });
    });
  });
};

exports.sellWood = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  console.log('sellwood to andrew');

  users.findOne({_id: userId}, (err, user)=>{
    if(user.wood > 4){
      user.wood -= 5;
      user.cash++;
    }
    users.save(user, ()=>res.send(user));
  });
};
