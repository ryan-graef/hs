LoadState = function(){ }

LoadState.prototype = {
    progressBar: null,

    preload: function(){
        //configure the scaling to fit the window
        game.scale.minHeight = Config.size.height;
        game.scale.minWidth = Config.size.width;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.stage.smoothed = false;

        this.progressBar = this.add.sprite(this.game.world.centerX - 250, this.game.world.centerY, 'loadBar');
        this.progressBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.progressBar);

        //IMPORTANT: Configure all necessary resources in Config.js
        Config.sprites.forEach(function(sprite){
            game.load.image(sprite.key, sprite.imagePath);
        }, this);

        Config.animSprites.forEach(function(animSprite){
            game.load.atlasJSONHash(animSprite.key, animSprite.imagePath, animSprite.jsonPath);
        }, this);

        Config.tileMaps.forEach(function(tileMap){
            game.load.tilemap(tileMap.key, tileMap.jsonPath, null, Phaser.Tilemap.TILED_JSON);
        }, this);

        Config.fonts.forEach(function(font){
            game.load.bitmapFont(font.key, font.imagePath, font.xmlPath);
        }, this);

        Config.sfx.forEach(function(sfx){
            game.load.audio(sfx.key, sfx.filePath);
        }, this);

        Config.music.forEach(function(music){
            game.load.audio(music.key, music.filePath);
        }, this);
        
    },

    create: function(){
        game.state.start('MainState');

        Config.music.forEach(function(music){
            Config.musicObjects[music.key] = game.add.sound(music.key, 1, true);
        });

        Config.sfx.forEach(function(sfx){
            Config.sfxObjects[sfx.key] = game.add.sound(sfx.key, 1, false);
        }, this);
    },

    update: function(){
        
    },

    render: function(){

    }
}