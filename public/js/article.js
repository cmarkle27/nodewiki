var Article = Backbone.Model.extend({

	defaults: {
		"title": "untitled",
		"description": "Lorem Ipsum...",
		"author": "",
		"tags": [],
		"files": []
	},

	url: function() {
		return '/articles/' + this.get('_id');
	}

});


var ArticleView = Backbone.View.extend({

	initialize: function() {
		this.render(); // render on init
		// console.log(this.model);
	},

	render: function() {
		var title = '<h1>' + this.model.get('title') + '</h1>';
		var htmlText = '<div>' + this.model.get('htmlText') + '</div>';
		$(this.el).html( title + htmlText );
		console.log(this.el);
	}

});

// ------------------------------------------------------------------------
var Articles = Backbone.Collection.extend({
	model: Article,
	url: "/articles"
});


var ArticlesView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this, "render");
		this.render(); // render on init
		// this.collection.bind('add', this.render); // render on model change
	},

	render: function() {
		console.log(this.collection);
		/*		this.collection.each(function(article) {
			// var articleView = new articleView({model: article});
			console.log(article);
		}, this);*/
	}

});

// ------------------------------------------------------------------------
// index.js
var articles = new Articles({});
articles.fetch({
	success: function(coll, resp) {
		// console.log(coll);
		// console.log(coll.first());
		// console.log(coll.last());
		var articlesView = new ArticlesView({
			collection: coll
		});

		if (coll.length) {
			var articleView = new ArticleView({model:coll.last()});
			$("#view-content").html(articleView.el);
		}

	}
});

// articlesView.render();

var AppRouter = Backbone.Router.extend({

	routes: {
		"": "setDefault",
		"edit/:id": "getPost",
		"*actions": "defaultRoute"
	},

	setDefault: function() {
		window.location = '/#507ef0a30631a120fd000001';
	}

});


// Initiate the router
var app_router = new AppRouter();