var fs = require('fs'),
    c = require('chalk'),
    Supervisors = require('./lib/supervisors'),
    _ = require('underscore');

var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
                var aF = function(c) {
                    return _.pick(c, vmFilter)
                };


module.exports.Setup = function(socket, Supervisor, req, cb) {
    _.each(Supervisor.getVMs(), function(VM) {
        var Item = {
            type: 'button',
            id: 'item_' + VM.id,
            caption: 'CTID '+VM.id,
        data: VM,
            img: 'icon-add'
        };
        var Item = {
            type: 'toolbar',
            data: Item
        };
        socket.emit('newContainer', Item);
    });
    _.each(Supervisors.List(), function(sup) {
        var Item = {
            type: 'button',
            id: 'item_' + sup,
            caption: sup,
            img: 'icon-add'
        };
        var Item = {
            type: 'toolbar',
            data: Item
        };
        socket.emit('pageItem', Item);
    });
    cb(null, {});
};
