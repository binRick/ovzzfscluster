#!/usr/bin/env node

var vz = require('./'),
    _ = require('underscore'),
    c = require('chalk'),
    pj = require('prettyjson');


var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var hostFilter = ['ip'];

vz.containerTypes.register(vz.containers.Node);

var Dorado = new vz.Host('66.35.71.146', []);
var Cluster = new vz.Cluster(Dorado);

console.log(c.green.bgBlack('Cluster Initialized w/', Cluster.hosts.length, ' hosts'));

var fC = function() {
/*    var vms = Cluster.getContainersByType(vz.containers.Node);
    _.each(vms, function(vm) {
        var VM = _.pick(vm, vmFilter);
        var Host = _.pick(vm.host, hostFilter);
        console.log(pj.render(VM));
    });*/
    var countSoup = new vz.supervisors.Count(Cluster, vz.containers.Node, 2, false);

};

setInterval(fC, 3000);
