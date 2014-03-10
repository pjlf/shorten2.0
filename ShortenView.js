
var ShortenView = Backbone.View.extend({

	tagName: "tr",
	template: _.template($('#listaURLs').html()),
	//template: '',

	initialize: function(){
		this.model.on('change', this.render, this);
	},

	render: function(){
		var col1 = $('<td>');
		var col2 = $('<td>');
		var link1 = $('<a>');
		var link2 = $('<a>');

		this.$el.empty();

		this.$el.attr("id", this.model.get('id'));

		link1.attr("href", this.model.get('shortURL'));
		link1.attr("target", "_blank");
		link1.html(this.model.get('shortURL'));
		col1.append(link1);
		// Adiciona número de acessos
		if (this.model.get('count') > 0){
			var elCount = $('<span>');
			elCount.text(this.model.get('count'));
			elCount.addClass('badge');
			col1.append(elCount);
		}
		var aux = this.model.get('originalURL').indexOf("http:");
		if (aux == -1){
			link2.attr("href", "http://" + this.model.get('originalURL'));			
		}
		else{
			link2.attr("href", this.model.get('originalURL'));
		}

		link2.attr("target", "_blank");
		link2.html(this.model.get('originalURL'));
		col2.append(link2);

		this.$el.append(col1);
		this.$el.append(col2);

		// this.setElement(this.$el);

		return this;
	}
})
