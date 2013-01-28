var Chat = module.exports = {
	  users:[]
	, rooms: []
	, hasUser: function(nickname) {
		// nickname 과 동일한 정보가 이미 사용되고 있는지 체크한다.
		//var users = this.users.filter(function(element) {
		//	return (element === nickname);
		//});
		
		//return (users.length > 0); 
		
		return this.util.hasData(nickname, this.users, function(elem) {
			return (elem === nickname);
		});
		
	}
	, addUser: function(nickname) {
		//this.users.push(nickname);
		this.util.addData(nickname, this.users);
	}
	// 방 관련
	, hasRoom: function(roomname) {
		return this.util.hasData(roomname, this.rooms, function(element) {
			return (element.name === roomname);
		});
	}
	, addRoom: function(roomname) {
		this.util.addData({name: roomname, attendants: []}, this.rooms);
	}
	, getRoomList: function() {
		return this.rooms.map(function(elem) {
			return elem.name;
		});
	}
	, util: {
		hasData: function(data, group, callback) {
			 var result = group.filter(callback);
			 return (result.length > 0);
		}
		, addData: function(data, group) {
			group.push(data);
		}
	}
};