var Article = Backbone.Model.extend({

	defaults: {
		"title": "untitled",
		"description": "Lorem Ipsum...",
		"author": "",
		"tags": [],
		"files": []
	},

	initialize: function(attributes) {
		this.id = attributes['_id'] || attributes['id'];
    },

	url: function() {
		return '/articles/' + this.get('_id');
	}

});

// ------------------------------------------------------------------------

var ArticleView = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	edit: function() {
		//window.location = '/#edit/' + this.model.get('_id');
		$('#edit-article').hide();
		$('#save-article').show();
		$('#cancel-edit').show();

	},

	saveChanges: function(form) {
		this.model.set('title', form.title);
		this.model.save();
		//alert(this.model.isNew());
	},

	render: function() {
		var title = '<h1>' + this.model.get('title') + '</h1>';
		var htmlText = '<div>' + this.model.get('htmlText') + '</div>';
		$(this.el).html( title + htmlText );
		console.log(this.model);
	}

});

// ------------------------------------------------------------------------

var EditView = Backbone.View.extend({

	initialize: function() {
		this.render(); // render on init
	},

	render: function() {
		var title = '<label for=edit_title>Title</label>' + '<input type=text name=title value="' + this.model.get('title') + '">';
		var editText = '<textarea name=article-content id=article-content rows=10>' + this.model.get('description') + '</textarea>';
		$(this.el).html( title + editText );
	}

});
