Config = {
    name: "ReplaceWithGameName",
    version: "0.0.0",
    size: {width: 960, height: 540},
    sprites: [
        //{key: "SpriteKey", imagePath: "path/to/image"}
        {key: "phaser", imagePath: "res/img/wrapper/phaser-logo-small.png"},
        {key: "pixel-guy", imagePath: "res/img/pixel-guy.png"},
        {key: "tileset", imagePath: "res/img/tileset.png"}
    ],
    animSprites: [
        //{key: "SpriteKey", imagePath: "path/to/image", jsonPath: "path/to/json"}
    ],
    //tilemaps are assumed to be Tiled JSON.
    tileMaps: [
        //{key: "MapKey", jsonPath: "path/to/json"}
        {key: "level", jsonPath: "res/lvl/level.json"}
    ],
    fonts: [
        //{key: "FontKey", imagePath: "path/to/image", xmlPath: "path/to/XML"}
        {key: "font", imagePath: "res/img/font.png", xmlPath: "res/img/font.xml"}
    ],
    sfx: [
        //{key: "SfxKey", filePath: "path/to/audiofile"}
    ],
    //music loops by default
    music: [
        //{key: "MusicKey", filePath: "path/to/audiofile"}
    ],
    //will be populated by all the music objects after load
    musicObjects: { },
    //will be populated by all the sfx objects after load
    sfxObjects: { },

}