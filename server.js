var http = require('http'),
    fs   = require('fs'),
    io   = require('socket.io').listen(8889); // for npm, otherwise use require('./path/to/socket.io') 

// Reducing socket.io log (debug) statements
io.set('log level', 2);

http.createServer(function (request, response) {
	fs.readFile(__dirname+'/public/index.html', function (err, data) {
		if (err) throw err;
		response.setHeader("Content-Type", "text/html");
		response.end(data);
	});
}).listen(8888);

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

