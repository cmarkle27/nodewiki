var express = require("express");
var path = require("path");
var mongoose = require('mongoose');
var markdown = require('markdown');
var app = express();
var config = require('./config');

var Article = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  htmlText: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  tags: [],
  files: [],
  modified: {
    type: Date,
  default:
    Date.now
  }
});

var ArticleModel = mongoose.model('Article', Article);

// Database
mongoose.connect('mongodb://' + config.mhquser + ':' + config.mhqpass + '@alex.mongohq.com:10084/nikki');

// Config
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

///////////////////////////////////////////////////////////////////////////
// routes
///////////////////////////////////////////////////////////////////////////

// list all
app.get('/articles', function(req, res) {
  return ArticleModel.find(function(err, articles) {
    if(!err) {
      return res.send(articles);
    } else {
      return console.log(err);
    }
  });
});

// create new
app.post('/articles', function(req, res) {
  var article;
  console.log("POST: ");
  console.log(req.body);
  // tags, files, etc... prevalidation?
  article = new ArticleModel({
    title: req.body.title,
    description: req.body.description,
    htmlText: markdown.markdown.toHTML(req.body.description)
  });
  article.save(function(err) {
    if(!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(article); // message instead???
});

// display single
app.get('/articles/:id', function(req, res) {
  return ArticleModel.findById(req.params.id, function(err, article) {
    if(!err) {
      return res.send(article);
    } else {
      return console.log(err);
    }
  });
});

// update single
app.put('/articles/:id', function(req, res) {
  return ArticleModel.findById(req.params.id, function(err, article) {
    article.title = req.body.title;
    article.description = req.body.description;
    article.htmlText = req.body.description;
    return article.save(function(err) {
      if(!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(article);
    });
  });
});

// delete single
app.delete('/articles/:id', function(req, res) {
  return ArticleModel.findById(req.params.id, function(err, article) {
    return article.remove(function(err) {
      if(!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

// Launch server
app.listen(4242);
console.log("wiki started on port 4242");