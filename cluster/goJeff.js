#!/usr/bin/env node

var vz = require('./'),
    _ = require('underscore'),
    c = require('chalk'),
    pj = require('prettyjson');


var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var hostFilter = ['ip'];

vz.containerTypes.register(vz.containers.Node);

//var Dorado = new vz.Host('66.35.71.146', []);
var Jeffersoncity = new vz.Host('66.35.67.194',[]);
//var dCluster = new vz.Cluster(Dorado);
var jCluster = new vz.Cluster(Jeffersoncity);

//console.log(c.green.bgBlack('Cluster Initialized Dorado ', dCluster.hosts.length, ' hosts'));
console.log(c.green.bgBlack('Cluster Initialized Jeffersoncity ', jCluster.hosts.length, ' hosts'));

var fC = function() {
/*    var vms = Cluster.getContainersByType(vz.containers.Node);
    _.each(vms, function(vm) {
        var VM = _.pick(vm, vmFilter);
        var Host = _.pick(vm.host, hostFilter);
        console.log(pj.render(VM));
    });*/
    var countSoup = new vz.supervisors.Count(jCluster, vz.containers.Node, 1, false);
//    var countSou1p = new vz.supervisors.Count(dCluster, vz.containers.Node, 3, false);

};

setTimeout(fC, 3000);
