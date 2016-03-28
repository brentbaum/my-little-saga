var express = require('express');
var app = express();
var process = require('process');
var http = require('http').Server(app);

app.use('/', express.static(__dirname + '/'));
app.use('/creator', express.static(__dirname + '/map-creator/app'));

var server = app.listen(process.env.PORT || 5000);

console.log("Server started.");;
