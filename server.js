var http = require('http'),  
    io = require('socket.io'), // for npm, otherwise use require('./path/to/socket.io') 
    connect = require('connect');

var server = connect.createServer(
    connect.favicon()
  , connect.logger()
  , connect.static(__dirname + '/public')
);
server.listen(8888);
  
var model = {};
var clients = [];

// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){ 
  clients.push(client);
  // new client is here! 
  client.on('message', function(msg){
    set(model, msg.path, msg.value);
    clients.forEach(function(otherClient){
      if (client !== otherClient)
        otherClient.send(msg);
    });
  })
  client.send({path:'', value:model});
});

function set(obj, path, value) {
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
