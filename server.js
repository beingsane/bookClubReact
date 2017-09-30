// Include Server Dependencies
const express = require("express");
const bodyParser = require("body-parser");
//const passport = require("passport");
const morgan = require("morgan");
const path = require('path');
/* var cookieParser = require('cookie-parser')
var flash = require('connect-flash');
var session = require('express-session'); */

var db = require("./models");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 5001;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(morgan('dev'));

// Static directory
app.use(express.static("public"));


// Get user user's groups and discussions
app.get("/api/groups/:user", function (req, res) {
  db.User.findOne({
    where: { email: req.params.user },
  })
    .then(function (user) {
      user.getGroups({
        include: [db.Discussion]
      })
        .then(function (groups) {
          res.json(groups);
        });
    });
});

app.post("/api/library", function (req, res) {
  db.Library.create({
    title: req.body.title,
    author: req.body.author,
    comments: req.body.comments,
    link: req.body.link
  }).then(function (results) {
    res.json(results);
  });
});

app.get("/api/library/", function (req,res){
  db.Library.findAll()
  .then(function(results){
    console.log
    res.json(results);
  });
});

// Get a user based on their email. Create user if email not found.
app.get('/api/users/:email', function (req, res) {
  db.User.findOne({
    where: { email: req.params.email },
    include: [db.Library]
  }).then(function (user) {
    console.log(user);
    if (!user) {
      var newUser = {
        email: req.params.email,
      };
      db.User.create(newUser).then(function (result) {
        res.json(result)
      });
    } else {
      res.json(user);
    }
  });
})

// Add a new group and associate the user to that group
app.post("/api/groups", function (req, res) {
  db.Group.create({
    name: req.body.name
  })
    .then(function (group) {
      var groupID = group.id;
      db.User.findOne({
        where: { email: req.body.user },
      })
        .then(function (user) {
          user.addGroup(groupID)
        })
      res.json(group)
    })
});

// Create new discussion in database and associate it with a group
app.post("/api/groups/:group/discussions", function (req, res) {
  db.Discussion.create({
    name: req.body.name,
    GroupId: req.params.group
  }).then(function (results) {
    res.json(results)
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Get a specific Group's discussions
app.get("/api/groups/:group/discussions", function(req, res){
  db.Group.findById(req.params.group)
    .then(function(group){
      group.getDiscussions()
        .then(function(discussions){
          res.json(discussions)
        })
    });
})

// -------------------------------------------------

// Listener
db.sequelize.sync({ force: true }).then(function () {

  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});