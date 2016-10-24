var Player = function(startX, startY, rotation, id){
	return {
		x: startX,
		y: startY,
		rotation: rotation,
		alive: true,
		id: id,
		status: 'hider'
	}
};

exports.Player = Player;