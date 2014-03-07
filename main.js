
var shortenColl = new ShortenCollection();
var shortenViewC = new ShortenViewCollection({collection: shortenColl});

var domain = 'http://api.alfredo.r42.in/';
// var domain = 'http://localhost:8000/';

function sendURL(){
	var urlToSend = '';

	if ($('#urlToSend').val() == '')
		return;

	urlToSend = 'http://' + $('#urlToSend').val();

	$.ajax({
		url: domain,
		type: 'POST',
		data: { url: urlToSend },
		success: function(res) { 
			getListURLs();
			console.log('Done! Result:', res) 
		}
    });
    socket.emit('newShorten', { msg: 'newShorten: ' + urlToSend });
    $('#urlToSend').val('');

}

var bodyTabelaURL = null;

function getListURLs(){
	
	$.ajax({url: domain, success: function(recent) { 
		var shorten;
		var shortenView;

		// shortenColl.reset();

		for (var i=0; i<recent.length; i++){
			var auxModel = shortenColl.findModel(recent[i]);
			if(! auxModel){
				shorten = new Shorten();
				shorten.set({
					id: recent[i].id, 
					originalURL: recent[i].url,
					count: recent[i].count
				});
				shortenView = new ShortenView({model: shorten});
				shortenColl.add(shorten);
			}
			else{
				auxModel.set({count: recent[i].count});
				//shortenColl.set(auxModel);
			}
		}
		//$('#conteudo').append(shortenViewC.$el);
		console.log('Actualização realizada.');
	} 
	})
}

getListURLs();
// Actualizar lista a cada 30 segundos
myTimer = setInterval(getListURLs, 10000);

$('#conteudo').append(shortenViewC.$el);

var socket = io.connect(domain);
socket.on('saudacoes', function (data) {
		console.log(data);
	}
);
socket.on('respNewShorten', function(data) {
	alert('New Shorten');
	console.log(data);
})