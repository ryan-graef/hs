var game;
var socket;
var localPlayer;
var remotePlayers = [];

var timeLeft = 0;
var statusText;

document.addEventListener("DOMContentLoaded", function(event){
	//create a new game and run it
	game = new Phaser.Game(Config.size.width, Config.size.height, Phaser.CANVAS, 'game', null, false, false);

	//add the game states
	game.state.add('StartupState', new StartupState());
	game.state.add('LoadState', new LoadState());
	game.state.add('MainState', new MainState());

	//kickoff the starting state, logo if not on localhost, mainstate otherwise
    if(true || isDev()){
        game.state.start('LoadState');
    }else{
        game.state.start('StartupState');
    }
});

onSocketConnected = function(){
	console.log("Connected to socket.io");

	var x = game.world.randomX;
	var y = game.world.randomY;
	localPlayer = game.add.sprite(x, y, 'pixel-guy');
	localPlayer.data = {};
	localPlayer.anchor.setTo(0.5);
	game.camera.follow(localPlayer);
	game.physics.enable(localPlayer);
	localPlayer.body.collideWorldBounds = true;

	localPlayer.data.lamp = game.add.illuminated.lamp(localPlayer.x, localPlayer.y, {distance: 250, color: 'rgba(255,225,255,0.2)', radius: 150});
	localPlayer.data.lamp.createLighting([]);
	localPlayer.data.darkMask = game.add.illuminated.darkMask([localPlayer.data.lamp], 'rgba(0,0,0,0.8)');
	localPlayer.data.status = 'hider';

	socket.emit("new player", {x: localPlayer.x, y: localPlayer.y});
}

onSocketDisconnect = function(){
	console.log("Disconnected from socket.io");
}

onNewPlayer = function(data){
	console.log("New Player connected: "+data.id);

	var newSprite = game.add.sprite(data.x, data.y, 'pixel-guy');
	newSprite.data = {};
	newSprite.data.id = data.id;
	newSprite.anchor.setTo(0.5);
	newSprite.data.status = 'hider';
	remotePlayers.push(newSprite);
}

onTick = function(data){
	data.players.forEach(function(player){
		for(var i = 0; i < remotePlayers.length; i++){
			if(player.id == remotePlayers[i].data.id){
				remotePlayers[i].x = player.x;
				remotePlayers[i].y = player.y;
				remotePlayers[i].rotation = player.rotation;
				remotePlayers[i].alive = player.alive;
				remotePlayers[i].data.status = player.status;
			}
		}

		if(player.id == localPlayer.data.id){
			localPlayer.data.status = player.status;
			localPlayer.alive = player.alive;
		}
	}, this);

	timeLeft = data.timeUntilNewSeeker;

	var peopleCount = 0;
	remotePlayers.forEach(function(player){
		if(player.alive && player.data.status == "hider"){
			peopleCount++;
		}
	}, this);

	if(localPlayer.data.status == 'hider' && localPlayer.alive){
		peopleCount++;
	}

	var timeLeftString = "" + timeLeft;
	if(timeLeftString.length == 6){
		timeLeftString = timeLeftString[0] + timeLeftString[1] + timeLeftString[2];
	}else if(timeLeftString.length == 5){
		timeLeftString = timeLeftString[0] + timeLeftString[1];
	}else{
		timeLeftString = timeLeftString[0];
	}

	if(statusText){
		statusText.setText("Time left until new Seeker: " + timeLeftString +" seconds.  There are currently: " + peopleCount + " unfound players.");
	}
}

onRemovePlayer = function(data){
	console.log("Player disconnected: "+data.id);

	for(var i = 0; i < remotePlayers.length; i++){
		if(remotePlayers[i].data.id == data.id){
			remotePlayers[i].destroy();
			remotePlayers.splice(i, 1);
			break;
		}
	}
}

onAssignId = function(data){
	console.log("I'm player: "+data.id);
	localPlayer.data.id = data.id;
}

onNewGame = function(){
	localPlayer.alive = true;
}