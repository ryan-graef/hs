var Player = function(startX, startY, rotation, id, displayName){
	return {
		x: startX,
		y: startY,
		rotation: rotation,
		alive: true,
		id: id,
		status: 'hider',
		displayName: displayName
	}
};

exports.Player = Player;