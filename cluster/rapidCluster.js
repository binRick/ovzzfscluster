#!/usr/bin/env node

var program = require('commander');
program
    .version('0.0.1')
    .option('-h, --host [host]', 'Set host', 'Host')
    .option('-t, --template [template]', 'Specify OS template', 'Template')
    .option('-c, --count [count]', 'Specify Node Quantity', 'NodeCount')
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

if (program.host && program.template && program.count) {
    if (program.host.split(',').length == 0)
        var hosts = [host];
    else
        var hosts = program.host.split(',');
    var Hosts = [];
    ips = [];
    host = hosts[0];
//    _.each(hosts, function(host) {
        dns.lookup(host, function onLookup(e, ip, family) {
        dns.lookup(hosts[1], function onLookup(e, ip2, family) {
            if (e) throw e;
            console.log(c.green.bgBlack('looking up', host, c.red.bgBlack(ip)));
            if (ip.split('.').length != 4) throw "ip=" + ip;
//            ips.push(ip);
            var Host = new vz.Host(ip, []);
//            var Host1 = new vz.Host(ip2, []);
            var Cluster = new vz.Cluster(Host);
//            Cluster.register(Host1);
    console.log(c.green.bgBlack('Cluster Init', ip));
var fC = function() {
    var countSou1p = new vz.supervisors.Count(Cluster, vz.containers[program.template], program.count, false);
};
setTimeout(fC, 3000);
        });
        });
//    });
//    setTimeout(function(){
 /*   console.log(c.green.bgBlack('Cluster Init'));
        console.log(ips, Hosts.length);
            var Cluster = new vz.Cluster(Hosts);
    }.bind(this), 4500);*/

    //console.log(c.green.bgBlack('Cluster Initialized ' + program.host, 'with ip', ip, Cluster.hosts.length, ' hosts'));
    //        setTimeout(function(){
    //        console.log(c.green.bgBlack('Creating node cluster of ',program.count,'nodes of type',program.template));
    //            var myCuster = new vz.supervisors.Count(Cluster, vz.containers[program.template], program.count, false);
    //        }, 3500);


}



