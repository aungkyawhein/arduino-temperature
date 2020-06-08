
/*
Serial to Socket.io example
Shows how to make a basic webSocket connection between a client and a server
using Socket.io version 1.0 or later (http://socket.io/)
Takes data from the command line to drive a graphic
generated in  p5.js (http://p5js.org/)
To run it from the command line:
node server.js serialport
where serialport is the name of your serial port.
created 10 Jun 2015
by Tom Igoe
*/

// server initialization:
var express = require('express');   // include express.js
  io = require('socket.io'),        // include socket.io
  app = express(),                  // make an instance of express.js
  server = app.listen(8888),        // start a server with the express instance
  socketServer = io(server);        // make a socket server using the express server

// serial port initialization:
var serialport = require('serialport'),     // include the serialport library
  SerialPort  = serialport.SerialPort,      // make a local instance of serial
  portName = process.argv[2],               // get the port name from the command line
  portConfig = {
    baudRate: 9600,
    // call myPort.on('data') when a newline is received:
    parser: serialport.parsers.readline('\n')
  };

// open the serial port:
var myPort = new SerialPort(portName, portConfig);

// for slack integration
var temp = 0;
var Slack = require('node-slackr');

//  set up server and socketServer listener functions:
app.use(express.static('public'));          // serve files from the public folder
app.get('/', serveFiles);              // listener for all static file requests
socketServer.on('connection', openSocket);  // listener for websocket data

function serveFiles(request, response) {
  var fileName = request.params.html;       // get the file name from the request
  response.sendFile(fileName);              // send the file
}

function openSocket(socket) {
  console.log('new user address: ' + socket.handshake.address);
  // send something to the web client with the data:
  socket.emit('message', 'Hello, ' + socket.handshake.address);

  // this function runs if there's input from the client:
  socket.on('message', function(data) {
    myPort.write(data);             // send the data to the serial device
  });

  // this function runs if there's input from the serialport:
  myPort.on('data', function(data) {
    socket.emit('message', data);   // send the data to the client
    console.log(data);
    temp = data.replace(/(\r\n|\n|\r)/gm,''); // remove line break
  });
}

setInterval(function() {
  // send message to slack every 15 mins 
  slackNotify(temp);
}, 900000);

function slackNotify(temp) {
  var icon = ":sunflower:";
  var color = "#000000";
  if(temp > 29 ) {
    icon = ":sunny:";
    color = "#ff0000";
  }else if( temp > 28 && temp < 29) {
    icon = ":partly_sunny:";
    color = "#00ff00";
  }else {
    icon = ":snowflake:";
    color= "#0000ff";
  }
  var slack = new Slack('https://hooks.slack.com/services/Your/Webhook/URL');
  var messages = {
    "text": "Room Temperature",
    "channel": "#arduino-temperature",
    "username": "temperature-bot",
    "icon_emoji": icon,
    "attachments": [
      {
        "fallback": "Room Temperature "+ temp + " *C",
        "color": color,
        "text": temp + " *C"
      }
    ]
  };
  slack.notify(messages);
}