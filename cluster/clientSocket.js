var fs = require('fs'),
    c = require('chalk'),
    Supervisors = require('./lib/supervisors'),
    _ = require('underscore');



module.exports.Setup = function(socket, req, cb) {
    _.each(Supervisors.List(), function(sup) {
        var Item = {
            type: 'button',
            id: 'item_'+sup,
//            group: '1',
            caption: sup,
            img: 'icon-add'
        };
        var Item = {
            type: 'toolbar',
            data: Item
        };
        console.log(Item);

        socket.emit('pageItem', Item);
    });
    cb(null, {});
};
