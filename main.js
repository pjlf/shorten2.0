
var shortenColl = new ShortenCollection();
var shortenViewC = new ShortenViewCollection({collection: shortenColl});
var token = '';

var domain = 'http://api.alfredo.r42.in/';
// var domain = 'http://localhost:8000/';

function login(){
	var user = $('#inputUser').val();
	var pass = $('#inputPass').val();
	if (user == ''){
		alert('Utilizador não preenchido');
		return;
	}
	if (pass == ''){
		alert('Password não preenchido');
		return;
	}
	// enviar pedido de autenticação
	$.ajax({
		url: domain + 'login',
		type: 'POST',
		data: { user: user, password: pass },
		success: function(res) {
			token = res;
			alert('Autenticado');
			console.log(token); 
			$('#divLogin').hide();
			$('#nomeUser').text(user);
		},
		error: function(res){
			if (res.status === 403)
				alert(res.responseText);
			else
				alert('Erro ao autenticar utilizador.');
			console.log(res);
		}
    });
}

function restartLogin(){
	$('#divLogin').show();
	$('#nomeUser').text('');
	token = '';
}

function sendURL(){
	var urlToSend = '';

	if ($('#urlToSend').val() == '')
		return;

	urlToSend = 'http://' + $('#urlToSend').val();

	$.ajax({
		url: domain,
		type: 'POST',
		headers: {
			"X-Auth-Token": token,
		},
		data: { url: urlToSend },
		success: function(res) { 
			getListURLs();
			console.log('Done! Result:', res); 
		},
		error: function(res){	
			console.log(res);
			alert(res.responseText);
			if (res.status === 401)
				restartLogin();		
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
myTimer = setInterval(getListURLs, 60000);

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