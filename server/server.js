var util = require("util"),
	io = require("socket.io")(),
	Player = require("./player").Player;

var socket, players;

var timeUntilNewSeeker = 120000;
var timeBetweenSeekers = 120000;
var currentSeeker;

function init() {
	players = [];

	socket = io.listen(server);
	// socket.configure(function(){
		
	// 	socket.set("log level", 2);
	// });

	setEventHandlers();
}

function setEventHandlers(){
	socket.sockets.on("connection", onSocketConnection);

	setInterval(function(){
		sendTick();
		timeUntilNewSeeker -= 50;

		var anyoneAlive = false;
		for(var i = 0; i < players.length; i++){
			if(players[i].alive && players[i].status == 'hider'){
				anyoneAlive = true;
			}
		}

		if(timeUntilNewSeeker <= 0 || !anyoneAlive){
			timeUntilNewSeeker = timeBetweenSeekers;
			if(players.length > 1){
				pickNewSeeker();
			}
		}
	}, 50);
}

function pickNewSeeker(){
	timeUntilNewSeeker = timeBetweenSeekers;

	for(var i = 0; i < players.length; i++){
		var player = players[i];
		player.alive = true;
		player.status = 'hider';
	}

	var r = Math.floor(Math.random()*players.length);
	if(r < players.length){
		players[r].status = 'seeker';
		console.log('picked '+players[r].id+' to be the seeker');
	}

	socket.emit('new game');
}

function onSocketConnection(client){
	util.log("New Player has connected: "+client.id);
	client.on("disconnect", onClientDisconnect);
	client.on("new player", onNewPlayer);
	client.on("tick", onTick);
	client.on("killed player", onKilledPlayer);
}

function onKilledPlayer(data){
	console.log('killed player' + data.id);
	for(var i = 0; i < players.length; i++){
		if(players[i].id === data.id){
			players[i].alive = false;
			break;
		}
	}
}

function onClientDisconnect(){
	util.log("Player: " + this.id + " has disconnected");

	for(var i = 0; i < players.length; i++){
		if(players[i].id === this.id){
			players.splice(i, 1);
			break;
		}
	}

	this.broadcast.emit("remove player", {id: this.id});
}

function onNewPlayer(data){
	util.log("New Player created: "+data.displayName+" at "+data.x+","+data.y);

	this.broadcast.emit("new player", {id: this.id, x: data.x, y: data.y, displayName: data.displayName});

	players.push(new Player(data.x, data.y, 0, this.id, data.displayName));
	this.emit("assign id", {id: this.id});
	for(var i = 0; i < players.length; i++){
		if(players[i].id !== this.id){
			this.emit("new player", {id: players[i].id, x: players[i].x, y: players[i].y, displayName: players[i].displayName});
		}
	}

	pickNewSeeker();
}

function onTick(data){
	for(var i = 0; i < players.length; i++){
		if(data.id === players[i].id){
			players[i].x = data.x;
			players[i].y = data.y;
			players[i].rotation = data.rotation;
			players[i].alive = data.alive;
		}
	}
}

function sendTick(){
	socket.emit("tick", {players: players, timeUntilNewSeeker: timeUntilNewSeeker, currentSeeker: currentSeeker});
}

init();