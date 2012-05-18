'use strict';
// Requirements
var express    = require('express'),
    path       = require('path'),
    fs         = require('fs'),
    request    = require('request'),

// Variables
    port       = process.env.PORT || 9294,
    env        = process.env.NODE_ENV || 'development',
    publicPath = __dirname + '/public',
    index      = publicPath + '/index.html',
    address, serverHostname, serverPort, serverLocation, makeRequest, isEmptyObject, serialize;

// Create Server
if (env === 'development')
  var server   = express.createServer({
      ca:   fs.readFileSync('certs/sub.class1.server.ca.pem'),
      key:  fs.readFileSync('certs/ssl.key'),
      cert: fs.readFileSync('certs/ssl.crt')
    });
else
  var server   = express.createServer();

// Configure
server.configure(function() {
  server.use(express.logger());
  // Standard
  server.use(express.errorHandler());
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  
  // Routing
  server.use(server.router);
  server.use(express.static(publicPath));
});

// isEmptyObject = function( obj ) {
//   for ( var name in obj ) {
//     return false;
//   }
//   return true;
// };
// 
// serialize = function(obj) {
//   var str = [];
//   for(var p in obj)
//      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//   return str.join("&");
// };
// 
// makeRequest = function(req, rsp) {
//   var options = {}; 
//   options.headers = {};
//   for (var key in req.headers) {
//     if (key.indexOf('accept-') === 0) continue;
//     options.headers[key.charAt(0).toUpperCase() + key.substr(1)] = req.headers[key];
//   }
// 
//   options.url = req.headers.proxy;
//   options.method = req.method;
//   
//   if (!isEmptyObject(req.body)) {
//     if (req.headers['content-type'].indexOf('x-www-form') !== -1) {
//       options.body = serialize(req.body);
//     } else {
//       options.body = JSON.stringify(req.body);
//     }
//   }
//   
//   request(options, function(e, r, body) {
//     if (body) {
//       rsp.send(body, r.headers, r.statusCode);
//     } else {
//       rsp.send(r.headers, r.statusCode);
//     }
//   });
// };

//server.all('/api', makeRequest);
server.get('/', function(req, res) {
  res.send('Hello World!');
  // res.contentType(index);
  // res.sendfile(index);
});

// Listen
server.listen(port, function() {
  if (env !== 'development') console.log("Listening on " + port);
  else {
    // Log
    address = server.address();
    serverHostname = address.address == '0.0.0.0' ? 'localhost' : address.address;
    serverPort = address.port;
    serverLocation = 'http://' + serverHostname + ':' + serverPort + '/';
    console.log('Simple-Server listening to ' + serverLocation + ' with directory ./public');
  }
});