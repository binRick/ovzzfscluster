var util = require('util'),
    log = require('czagenda-log').from(__filename),
    Container = require('../container').Container;
    

var Node = function Node() {
  Container.apply(this,Array.prototype.slice.call(arguments));
  this.ostemplate = 'centos-7-x86_64__nodejs_supervisor'
};
util.inherits(Node, Container);

Node.type = 'nodeRick';


Node.prototype.installNode = function(callback) {
var cmds=             [
        'cd /root/',
        'wget http://nodejs.org/dist/v0.12.4/node-v0.12.4-linux-x64.tar.gz',
        'tar -zxf node-v0.12.4-linux-x64.tar.gz',
        'yum -y install rsync',
        'rsync -ar node-v0.12.4-linux-x64/bin/* /usr/bin/',
        'rsync -ar node-v0.12.4-linux-x64/include/* /usr/include/',
        'rsync -ar node-v0.12.4-linux-x64/lib/* /usr/lib/',
        'rsync -ar node-v0.12.4-linux-x64/share/* /usr/share/',
        'cd /root/',
        'rm -Rf node-*'
        ].join(' && ');
//        cmds = ['cd /root','ls'].join(' && ');
		
		// theses stuff are included in template
     log.info('Install node');
     console.log(red.bgBlack(cmds));
     this.exec(cmds, null,function(err,res) {
          if(err) {
            log.warning('Node install failed',err);
            callback(err,null);
            return;
          }
          log.info('Node install done');
          
          callback(null, res);
          
      }.bind(this));    
}
exports.Container = Node
