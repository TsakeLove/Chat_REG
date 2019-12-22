var app = require('../app');
var debug = require('debug')('passport-mongo:server');
var http = require('http');
let User = require("../models/user");
let us = require("../routes/index");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheme = new Schema({ text: String, author : String }, { versionKey: false });
const Message = mongoose.model("Mesage", userScheme);
const connections = [];
const dbConfig = require("../db");
mongoose.connect(dbConfig.url, {useNewUrlParser: true});
// array to store current users
const users = [];
// array for storing current messages
let messages = [];
var port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

var server = http.createServer(app);

var io = require('socket.io')(server);
io.on('connection', socket => {
  console.log('A1---------------------------------------');
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('message', data => {
    console.log('have got a message');
    // Message.create({name: "-", message: data});
    io.sockets.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('DISCONNECT');
  });
});
io.on('connection', (socket) => {
  connections.push(socket);


  console.log('Connected: %s sockets connected', connections.length);
  // end of connection
  io.sockets.emit('users loaded', { users });
  Message.find({}, function (err,data1) {
    messages = [];

    data1.forEach(ms => { messages.push(ms); });

  })
  Message.find({}).sort({_id:-1}).limit(4).exec(function (err,data1) {
    messages_to_see = [];
    data1.forEach(ms => {
      messages_to_see.push(ms)
    });
  })
  socket.on('disconnect', () => {
    const index = connections.indexOf(socket);
    // remove a broken connection from the list of current connections
    // const deletedItem = connections.splice(index, 1);
    // remove user from array of current users
    users.splice(index, 1);
    console.log("NOW " + users);
    // update the list of users on the client

    console.log('Disconnected: %s sockets connected', connections.length);
  });
  // message processing
  socket.on('send message', (data) => {
    // save message
    //   messages.push(data);
    users.push(data.author);
    console.log(data.author);
    console.log("AAA " + data.author);
    Message.create({text: data.text, author: data.author}, console.log("I push in database!"));
    messages.push(data);

    console.log(users);

    // raise a chat message event and send it to all available connections
    io.sockets.emit('chat message', data);
  });



  // upload messages
  socket.on('load messages', () => {


    socket.emit('messages loaded', { messages });
  });
  // add new user to chat
  socket.emit('new user', { name: users[users.length - 1] });
});
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

