ConfigState = function(){ }

ConfigState.prototype = {
    preload: function(){

    },

    create: function(){
        $('body').append('<div id="config-screen">' +
                '<p style="text-align: center"> Hello, welcome to Spooky.zone! </p>' +
                '<p style="text-align: center"><label>Name:</label><input type="text" value="'+displayName+'" style="margin: 0 5px;" id="name-input"></input>'+
                '<button onclick="submitNameInput()">join the game!</button></p>' +
            '</div>');
    },

    update: function(){

    },

    render: function(){

    }
}

submitNameInput = function(){
    displayName = $('#name-input').val();
    $('#config-screen').remove();
    game.state.start('MainState');
}