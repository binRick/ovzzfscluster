#!/usr/bin/env node

var vz = require('./'),
    _ = require('underscore'),
    c = require('chalk'),
    pj = require('prettyjson');


var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var hostFilter = ['ip'];

vz.containerTypes.register(vz.containers.nodeRick);

var Dorado = new vz.Host('66.35.71.146', []);
var dCluster = new vz.Cluster(Dorado);

console.log(c.green.bgBlack('Cluster Initialized Dorado ', dCluster.hosts.length, ' hosts'));

var fC = function() {
    var countSou1p = new vz.supervisors.Count(dCluster, vz.containers.nodeRick, 100, false);
};

setTimeout(fC, 3000);
