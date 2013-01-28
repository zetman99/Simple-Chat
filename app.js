
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Chat = require('./bin/chat');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , Room = require('./bin/room')(io, Chat);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'zetfactory'}));	// session
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Room init


app.get('/', routes.index);
app.get('/users', user.list);
app.get('/enter', function(req, res) {
	if( req.session.nickname) {
		res.render('enter', {
			title: "enter"
			, isSuccess: true
			, nickname: req.session.nickname
			, roomList: Chat.getRoomList()
		});
	} else {
		res.render('enter', {
			title: 'enter'
			, isSuccess: false
			, nickname: ''
		});
	}
		
});

app.post('/enter', function(req, res) {
	var isSuccess = false
	  , nickname = req.body.nickname;
	
	if(nickname && nickname.trim() !== '') {
		if(!Chat.hasUser(nickname)) {
			Chat.addUser(nickname);
			req.session.nickname = nickname;
			isSuccess = true;
		}
	}
	
	res.render('enter', {
		title: 'Simple Chat Demo',
		isSuccess: isSuccess,
		nickname: nickname,
		roomList: Chat.getRoomList()
	});	
	
});

app.post('/makeRoom', function(req, res) {
	var isSuccess = false
	  , roomName = req.body.roomname;
	  
	if(roomName && roomName.trim() !== '') {
		if(!Chat.hasRoom(roomName)) {
			Chat.addRoom(roomName);
			isSuccess = true;
		}
	}
	res.render('makeRoom', {
		title: "Make Room"
		, isSuccess: isSuccess
		, roomName: roomName
	});
});

app.get('/join/:id', function(req, res) {
	var isSuccess = false
	  , roomName = req.params.id;
	console.log('join.id : ' + roomName);  
	if(Chat.hasRoom(roomName)) {
		isSuccess = true;
	}
	
	res.render('room', {
		title: "room"
		, isSuccess: isSuccess
		, roomName: roomName
		, nickName: req.session.nickname
	});
});

//-- server start
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
