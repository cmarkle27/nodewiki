
// ------------------------------------------------------------------------

// we may need to use some promises to avoid doing two collection fetches
// (one for nav, one for last article)
// i.e.: on(articleList.fetch()) f.getLast();

var articleList = new ArticleList({});
//articleList.display()

var AppRouter = Backbone.Router.extend({
	routes: {
		"": "noArticle",
		"edit/:id": "editArticle",
		"*actions": "viewArticle"
	}
});

// ------------------------------------------------------------------------

var currentArticle = null;

// Initiate the router
var appRouter = new AppRouter();

appRouter.on('route:noArticle', function() {
	articleList.getLast();
});

appRouter.on('route:viewArticle', function(actions) {
	var article = new Article({_id:actions});
	article.fetch({
		success: function(model, resp) {
			currentArticle = new ArticleView({model:model});
			$("#view-content").html(currentArticle.el).show();
			$("#edit-content").hide();
		}
	});
});

/*appRouter.on('route:editArticle', function(actions) {
	var article = new Article({_id:actions});
	article.fetch({
		success: function(model, resp) {
			var editView = new EditView({model:model});
			$("#edit-content").html(editView.el).show();
			$("#view-content").hide();
		}
	});
});*/

Backbone.history.start();

// this should be in the views
$("#edit-article").on('click', function() {
	currentArticle.edit();
});

$("#save-article").on('click', function() {
	console.log('saving');
	currentArticle.saveChanges({
		title: $('input[name=title]').val(),
		description: $('textarea[name=article-content]').val()
	});
	$('#edit-article').show();
	$('#save-article').hide();
	$('#cancel-edit').hide();
});
