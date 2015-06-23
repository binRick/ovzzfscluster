 var express = require('express'),
     bodyParser = require('body-parser');

 var app = new express();
 app.use(bodyParser());
 app.use(express.static(__dirname + '/public_html'));
 app.get('/', function(req, res) {
     res.send(JSON.stringify(program));
 });

 module.exports = app;
 module.exports.loadSupervisor = function(Supervisor, cb) {
     app.get('/Count/:newcount', function(req, res) {
         req.params.newcount = parseInt(req.params.newcount);
         if (req.params.newcount < 0 && req.params.newcount > MAXCOUNT)
             return res.end(500);
         console.log(c.red.bgBlack('Removing current count and replacing with', req.params.newcount));
         delete Supervisor;
     });
     app.get('/Host', function(req, res) {
         res.send(Supervisor.getHost());
     });
     app.get('/Hosts', function(req, res) {
         res.send(Supervisor.getHosts());
     });
     app.get('/VMs/:host', function(req, res) {
         res.send(Supervisor.getVMs(req.params.host));
     });
     app.get('/VMs', function(req, res) {
         res.send(Supervisor.getVMs());
     });



     cb(null, {});
 };