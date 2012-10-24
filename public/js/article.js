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

// ------------------------------------------------------------------------

var ArticleList = Backbone.Collection.extend({

	initialize: function() {
		this.display();
	},

	model: Article,

	url: "/articles",

	display: function() {
		this.fetch({
			success: function(coll, resp) {
				var articlesListView = new ArticlesListView({
					collection: coll
				});
			}
		});
	},

	getLast: function() {
		this.fetch({
			success: function(coll, resp) {
				if (coll.length) {
					window.location = '/#' + coll.last().get('_id');
				}
			}
		});
	}

});

// ------------------------------------------------------------------------

var ArticleView = Backbone.View.extend({

	initialize: function() {
		this.render(); // render on init
	},

	render: function() {
		var title = '<h1>' + this.model.get('title') + '</h1>';
		var htmlText = '<div>' + this.model.get('htmlText') + '</div>';
		$(this.el).html( title + htmlText );
	}

});


// ------------------------------------------------------------------------

var ArticlesListView = Backbone.View.extend({

	tagName: 'ul',

	initialize: function() {
		_.bindAll(this, "render");
		this.render(); // render on init
	},

	render: function() {
		var navItems = "";
		this.collection.each(function(article) {
			navItems += '<li><a href=#' + article.get('_id') + ">" + article.get('title') + '</a></li>';
		}, this);
		$('.sidebar-nav').html(navItems);
	}

});

// ------------------------------------------------------------------------

// we may need to use some promises to avoid doing two collection fetches
// (one for nav, one for last article)
// i.e.: on(rticleList.fetch()) f.getLast();

var articleList = new ArticleList({});
//articleList.display()

var AppRouter = Backbone.Router.extend({
	routes: {
		"": "setDefault",
		"edit/:id": "getPost",
		"*actions": "defaultRoute"
	}
});

// ------------------------------------------------------------------------

// Initiate the router
var appRouter = new AppRouter();

appRouter.on('route:setDefault', function() {
	articleList.getLast();
});

appRouter.on('route:defaultRoute', function(actions) {
	var article = new Article({_id:actions});
	article.fetch({
		success: function(model, resp) {
			var articleView = new ArticleView({model:model});
			$("#view-content").html(articleView.el);
		}
	});
});

Backbone.history.start();
