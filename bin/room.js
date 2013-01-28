
module.exports = function(io, chat) {
	var server = io
	  , Chat = chat;

	var Room = server
		.of('/room')
		.on('connection', function(socket) {
			
			var joinedRoom = null;
			socket.on('join', function(data) {
				console.log('join >> ' + data.roomName);
				if(Chat.hasRoom(data.roomName)) {
					joinedRoom = data.roomName;
					socket.join(joinedRoom);
					socket.emit('joined', {
						isSuccess: true,
						nickName: data.nickName
					});
					
					socket.broadcast.to(joinedRoom).emit('joined', {
						isSuccess: true,
						nickName: data.nickName
					});
				} else {
					socket.emit('joined', {isSuccess: false, nickName: ''});
				}
			});
			
			socket.on('message', function(data) {
				console.log('  recieve >> ' + joinedRoom + '  type of data : ' + typeof data);
				if(joinedRoom) {
					socket.broadcast.to(joinedRoom).json.send(data);
				}
			});
		});
};