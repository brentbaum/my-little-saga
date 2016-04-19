var express = require('express');
var app = express();
var process = require('process');
var http = require('http').Server(app);
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');

app.use('/', express.static(__dirname + '/'));
app.use('/creator', express.static(__dirname + '/map-creator/app'));
app.use(bodyParser.json()); 

app.post('/save/map', function(req, res) {
    var filename = 'maps/' + req.body.filename;
    var map = req.body.map;
    
    jsonfile.writeFile(filename, map, function (err) {
        res.json(filename);
    });
    
});

app.post('/save/mapping', function(req, res) {
    var filename = 'maps/tile-mapping.json';
    var mapping = req.body;
    
    jsonfile.writeFile(filename, mapping, function (err) {
        res.json(filename);
    });
    
});

app.post('/load/map', function(req, res) {
    var filename = 'maps/' + req.body.filename;
    jsonfile.readFile(filename, function (err, obj) {
        res.json(obj);
    });
});

app.get('/load/mapping', function(req, res) {
    var filename = 'maps/tile-mapping.json';
    jsonfile.readFile(filename, function (err, obj) {
        res.json(obj);
    });
});


var server = app.listen(process.env.PORT || 5000);

console.log("Server started.");;
