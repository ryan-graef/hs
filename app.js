process.title = "hs";

var express = require('express');
var path = require('path');
app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/client'));

// app.get('/', function(req, res) {
// 	res.sendFile(path.join(__dirname+'/client/index.html'));
// });

server = app.listen(app.get('port'), function() {
	require(__dirname + '/server/server.js');
});