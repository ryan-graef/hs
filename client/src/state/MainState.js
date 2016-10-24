MainState = function(){ }

MainState.prototype = {
    tickRate: 3,
    tickCounter: 0,
    cursors: null,
    moveSpeed: 100,

    preload: function(){
        console.log('preload main state');
    },

    create: function(){
        //connect to server
        socket = io.connect("", {transports:["websocket"]});
        socket.on("connect", onSocketConnected);
        socket.on("disconnect", onSocketDisconnect);
        socket.on("new player", onNewPlayer);
        socket.on("tick", onTick);
        socket.on("remove player", onRemovePlayer);
        socket.on('assign id', onAssignId);
        socket.on('new game', onNewGame);

        this.cursors = game.input.keyboard.createCursorKeys();

        game.physics.startSystem(Phaser.Physics.Arcade);

        this.level = game.add.tilemap('level');
        this.level.addTilesetImage('tileset', 'tileset');
        this.background = this.level.createLayer('background');
        this.foreground = this.level.createLayer('foreground');
        this.background.resizeWorld();
        this.level.setCollisionBetween(1, 500, true, this.foreground);

        statusText = game.add.text(15, 15, 'Currently no seeker', { font: "65px Arial", fill: "#ffffff", align: "center" });
        statusText2 = game.add.text(15, 40, 'You are not the seeker', { font: "65px Arial", fill: "#ffffff", align: "center" });
        statusText2.scale.setTo(0.3);
        statusText.scale.setTo(0.3);
        statusText2.fixedToCamera = true;
        statusText.fixedToCamera = true;

        //remove this line if not using lighting effects
        phaserIlluminated = game.plugins.add(Phaser.Plugin.PhaserIlluminated);

        this.sightBlockers = phaserIlluminated.createOpaqueObjectsFromSolidTiles(this.foreground);
    },

    update: function(){
        if(localPlayer){
            if(localPlayer.alive){
                localPlayer.alpha = 1;
                remotePlayers.forEach(function(player){
                    if(player.alive && this.isVisible(localPlayer, player)){
                        player.alpha = 1;

                        if(localPlayer.data.status == 'seeker'){
                            player.alive = false;
                            socket.emit('killed player', {id: player.data.id});
                        }
                    }else if(!player.alive){
                        player.alpha = 0.5;
                    }else{
                        player.alpha = 0;
                    }
                }, this);


                if(this.cursors.up.isDown){
                    localPlayer.body.velocity.x = Math.cos(localPlayer.rotation)*this.moveSpeed; 
                    localPlayer.body.velocity.y = Math.sin(localPlayer.rotation)*this.moveSpeed;
                }else if(this.cursors.down.isDown){
                    localPlayer.body.velocity.x = Math.cos(localPlayer.rotation)*-this.moveSpeed;
                    localPlayer.body.velocity.y = Math.sin(localPlayer.rotation)*-this.moveSpeed;
                }else{
                    localPlayer.body.velocity.setTo(0);
                }

                if(this.cursors.left.isDown){
                    localPlayer.rotation -= 0.05;
                }else if(this.cursors.right.isDown){
                    localPlayer.rotation += 0.05;
                }

                game.physics.arcade.collide(localPlayer, this.foreground);

                localPlayer.data.darkMask.refresh(localPlayer.rotation);
                localPlayer.data.lamp.x = localPlayer.x;
                localPlayer.data.lamp.y = localPlayer.y;
                localPlayer.data.lamp.lighting.objects = this.sightBlockers;
                localPlayer.data.darkMask.objects = this.sightBlockers;
                localPlayer.data.lamp.refresh(localPlayer.rotation);
                localPlayer.data.darkMask.bringToTop();
                localPlayer.data.lamp.bringToTop();
                localPlayer.bringToTop();

                if(statusText && statusText2){
                    game.world.bringToTop(statusText);
                    game.world.bringToTop(statusText2);

                    if(localPlayer.alive){
                        if(localPlayer.data.status == 'seeker'){
                            statusText2.setText('You are the seeker!');
                        }else{
                            statusText2.setText('You are not the seeker.');
                        }
                    }else{
                        statusText2.setText('You are dead.  Not big surprise.');
                    }
                }

                if(this.tickCounter < this.tickRate){
                    this.tickCounter++;
                }else{
                    this.tickCounter = 0;
                    socket.emit("tick", {id: localPlayer.data.id, x: localPlayer.x, y: localPlayer.y, rotation: localPlayer.rotation, alive: localPlayer.alive});
                }
            }else{
                localPlayer.alpha = 0.5;
                statusText2.setText('You are dead.  Not big surprise.');
            }
        }
    },

    isVisible: function(me, them){
        var dx = me.x - them.x, dy = me.y - them.y;
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(d <= 250){
            var angle = Math.atan2(dy, -dx);
            var angleArcLess = (-me.rotation - Math.PI/7)%Math.PI;
            var angleArcGreater = (-me.rotation + Math.PI/7)%Math.PI;
            if(angle <= angleArcGreater && angle >= angleArcLess){
                var line = new Phaser.Line(me.x, me.y, them.x, them.y);
                var tiles = this.foreground.getRayCastTiles(line, 4, true);
                if(tiles.length > 0){
                    return false;
                }else{
                    return true;
                }
            }
        }
    },

    render: function(){

    }
}