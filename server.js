var http = require('http');
var io = require('socket.io').listen(8889); // for npm, otherwise use require('./path/to/socket.io') 
var connect = require('connect');

// Reducing socket.io debug statements
io.set('log level', 2);

var server = connect.createServer(
    connect.favicon()
  , connect.logger()
  , connect.static(__dirname + '/public')
);
server.listen(8888);


function set(obj, path, value){
  var lastObj = obj;
  var property;
  path.split('.').forEach(function(name){
    if (name) {
      lastObj = obj;
      obj = obj[property=name];
      if (!obj) {
        lastObj[property] = obj = {};
      }
    }
  });
  lastObj[property] = value;
}
  
var model = {};
var clients = [];

// socket.io 
io.sockets.on('connection', function(socket){ 
  clients.push(socket);
  // new client is here! 
  socket.on('channel', function(msg){
    console.log('message:');
    console.log(msg);
    set(model, msg.path, msg.value);
    clients.forEach(function(otherClient){
      if (socket !== otherClient){
        console.log("emitting..");
        otherClient.emit("channel", msg);
      }
    });
    console.log(msg);
  });
  socket.emit("channel", {path:'', value:model});
});

