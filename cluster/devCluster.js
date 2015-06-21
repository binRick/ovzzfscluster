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

var vz = require('../openvz-cluster'),
    _ = require('underscore'),
    c = require('chalk'),
    pj = require('prettyjson'),
    dns = require('dns');

program.template = program.template || 'centos-7-x86_64';
var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var hostFilter = ['ip'];
vz.containerTypes.register(vz.containers[program.template]);

if (program.webserverPort) {
    var express = require('express'),
        bodyParser = require('body-parser');

    var app = new express();
    app.use(bodyParser());
    app.use(express.static(__dirname + '/public_html'));
    app.get('/', function(req, res) {
        res.send(JSON.stringify(program));
    });
}
if (program.host && program.template && program.count && program.supervisorType) {
    if (program.host.split(',').length == 0)
        var hosts = [host];
    else
        var hosts = program.host.split(',');
    var Hosts = [];
    ips = [];
    host = hosts[0];
    dns.lookup(host, function onLookup(e, ip, family) {
        dns.lookup(hosts[1], function onLookup(e, ip2, family) {
            if (e) throw e;
            console.log(c.green.bgBlack('looking up', host, c.red.bgBlack(ip)));
            if (ip.split('.').length != 4) throw "ip=" + ip;
            var Host = new vz.Host(ip, []);
            var Cluster = new vz.Cluster(Host);
            console.log(c.green.bgBlack('Cluster Init', ip));
            var fC = function() {
                var Supervisor = new vz.supervisors[program.supervisorType](Cluster, vz.containers[program.template], program.count, false);
                app.get('/Count/:newcount', function(req, res) {
                    req.params.newcount = parseInt(req.params.newcount);
                    if (req.params.newcount < 0 && req.params.newcount > MAXCOUNT)
                        return res.end(500);
                    console.log(c.red.bgBlack('Removing current count and replacing with', req.params.newcount));
                    delete Supervisor;
                });

                app.get('/Host', function(req, res) {
                    var cHosts = Supervisor.getHostsSortByCtnCount();
                    var Host = _.pick(cHosts[0], hostFilter);
                    res.send(Host);
                });

                app.get('/VMs', function(req, res) {
                    var cHosts = Supervisor.getHostsSortByCtnCount();
                    var VMs = cHosts[0].containers.map(function(c) {
                        return _.pick(c, vmFilter);
                    });
                    res.send(VMs);
                });
                if (program.webserverPort) {
                    app.listen(program.webserverPort, function(e) {
                        console.log(c.green.bgBlack('Express listening on port', program.webserverPort));

                    });
                }

            };
            setTimeout(fC, 3000);
        });
    });
}