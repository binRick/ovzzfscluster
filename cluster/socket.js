var c = require('chalk');
C = console.log;
var clientSocket = require('./clientSocket');
var hostFilter = ['ip', 'hostname', 'user'];
var _ = require('underscore');


var vmFilter = ['id', 'ip', 'hostname', 'status', 'vmStatus', 'ipMonitor', 'ostemplate']; //,'exec_queue'];
var aF = function(c) {
    return _.pick(c, vmFilter)
};
module.exports = function(Supervisor, cb) {

    var server = require('http').createServer();
    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        Supervisor.cluster.on('addContainer', function(container) {
            //                Supervisor.getHostsSortByCtnCount()[0].on('addContainer', function(container) {
            var C = aF(container)
            console.log(c.red.bgWhite('added new container!!!!'), _.keys(C));
            socket.emit('newContainer', C);
        });
        C(c.red.bgBlack('Connected!'));
        socket.on('ready', function(req) {
            clientSocket.Setup(socket, Supervisor, req, function(e, ok) {
                if (e) throw e;
                //                var vms = Supervisor.getHostsSortByCtnCount()[0].containers.map(aF);
                //                console.log(c.green.bgBlack('VMs loaded', vms.length));
                console.log(c.green.bgBlack('Finished clientSocket Setup'), ok);



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
        cb(null, {});
    });
};