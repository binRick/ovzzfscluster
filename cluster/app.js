 var express = require('express'),
        bodyParser = require('body-parser');

    var app = new express();
    app.use(bodyParser());
    app.use(express.static(__dirname + '/public_html'));
    app.get('/', function(req, res) {
        res.send(JSON.stringify(program));
    });

module.exports = app;


