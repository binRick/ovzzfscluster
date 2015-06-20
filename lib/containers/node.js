var util = require('util'),
    log = require('czagenda-log').from(__filename),
    Container = require('../container').Container;
    

var Node = function Node() {
  Container.apply(this,Array.prototype.slice.call(arguments));
  this.ostemplate = 'centos-7-x86_64'
};
util.inherits(Node, Container);

Node.type = 'node';


Node.prototype.installNode = function(callback) {
		
		// theses stuff are included in template
	
     log.info('Install node');
     this.exec( [
        'cd /root/',
/*        'wget http://nodejs.org/dist/v0.12.4/node-v0.12.4-linux-x64.tar.gz',
        'tar -zxf node-v0.12.4-linux-x64.tar.gz',
        'rsync -ar node-v0.12.4-linux-x64/bin/* /usr/bin/',
        'rsync -ar node-v0.12.4-linux-x64/include/* /usr/include/',
        'rsync -ar node-v0.12.4-linux-x64/lib/* /usr/lib/',
        'rsync -ar node-v0.12.4-linux-x64/share/* /usr/share/',
//        'cd /root/',
        'rm -Rf node-*',*/
        ].join(' && '), null,function(err,res) {
          if(err) {
            log.warning('Node install failed',err);
            callback(err);
            return;
          }
          log.info('Node install done');
          
          callback();
          
      }.bind(this));    
}
exports.Container = Node
