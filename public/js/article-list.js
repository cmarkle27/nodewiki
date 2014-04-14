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
