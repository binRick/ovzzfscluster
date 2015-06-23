#!/usr/bin/env node

var MAXCOUNT = 20
var program = require('commander');
program
    .version('0.0.1')
    .option('-h, --host [host]', 'Set host', 'Host')
    .option('-t, --template [template]', 'Specify OS template', 'Template')
    .option('-c, --count [count]', 'Specify Node Quantity', 'NodeCount')
    .option('-w, --webserverPort [webserverPort]', 'Enable Webserver Port', 'Webserver')
    .option('-s, --supervisorType [supervisorType]', 'Select Supervisor Type', 'Supervisor')
    .parse(process.argv);

var vz = require('./'),//openvz_cluster'),
    _ = require('underscore'),
    c = require('chalk'),
    async = require('async'),
    pj = require('prettyjson'),
    dns = require('dns'),
    http = require('http'),
    pty = require('pty.js'),
    term = require('term.js'),
    path = require('path'),
    ptyServer = require('./ptyServer');

var C = console.log;
program.template = program.template || 'centos-7-x86_64';
var hostFilter = ['ip','hostname','user'];
var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var aF = function(c) {
    return _.pick(c, vmFilter)
};
vz.containerTypes.register(vz.containers[program.template]);

if (program.webserverPort)
    var app = require('./app'),
    SocketIO = require('./socket');

if (program.host && program.template && program.count && program.supervisorType) {
    if (program.host.split(',').length == 0)
        var hosts = [host];
    else
        var hosts = program.host.split(',');
    var Cluster = new vz.Cluster();
    async.mapSeries(hosts, function(h, cb) {
        dns.lookup(h, function(e, ip) {
            var Host = new vz.Host(ip, {hostname:h});
            Cluster.register(Host);
            cb(e, {
                host: h,
                ip: ip,
                Host: Host
            });
        });
    }, function(e, hosts) {
        console.log(c.green.bgBlack('hosts'), hosts.length);
        var Supervisor = new vz.supervisors[program.supervisorType](Cluster, vz.containers[program.template], program.count, false);
        Supervisor.getHosts = function() {
            return _.toArray(Supervisor.getHostsSortByCtnCount()).map(function(s){
                return _.pick(s,hostFilter);  
            });
        };
        Supervisor.getVMs = function(host) {
            var cHosts = Supervisor.getHostsSortByCtnCount();
            var VMs = cHosts[0].containers.map(function(c) {
                return _.pick(c, vmFilter);
            });
            return VMs;
        };
        app.loadSupervisor(Supervisor, function(e,d){
        if (program.webserverPort) {
            app.listen(program.webserverPort, function(e) {
                console.log(c.green.bgBlack('Express listening on port', program.webserverPort));
                SocketIO(Supervisor, function(e, ok){
                    if(e)throw e;
                console.log(c.green.bgBlack('Socket io listening'));
                });
//                createSocketServer(Supervisor);
            });
        }
        });

    });
}
/*
var clientSocket = require('./clientSocket');


var createSocketServer = function(Supervisor) {
    var server = require('http').createServer();
    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        C(c.red.bgBlack('Connected!'));
        socket.on('ready', function(req) {
            clientSocket.Setup(socket, Supervisor, req, function(e, ok) {
                if (e) throw e;
//                var vms = Supervisor.getHostsSortByCtnCount()[0].containers.map(aF);
//                console.log(c.green.bgBlack('VMs loaded', vms.length));
                console.log(c.green.bgBlack('Finished clientSocket Setup'), ok);


                Supervisor.getHostsSortByCtnCount()[0].on('addContainer', function(container) {
                    var C = aF(container)
                    console.log(c.red.bgWhite('added new container!!!!'), _.keys(C));
                    socket.emit('newContainer', C);
                });

            });
        });
        socket.on('disconnect', function() {
            C(c.red.bgWhite('disconnection'));
        });
        socket.on('Snapshot', function(req, cb) {
            C(c.red.bgBlack('Snapshot Request!', req));
            cb(null, {});
        });
    });
    server.listen(process.env.PORT || 29232, process.env.HOST || '0.0.0.0', function() {
        C(c.blue.bgWhite('Listening!'));
    });
};
*/
