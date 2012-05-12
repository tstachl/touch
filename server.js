// Requirements
var express    = require('express'),
    path       = require('path'),
    fs         = require('fs'),

// Variables
    publicPath = path.resolve(process.argv[2] || '.'),
    port       = process.argv.slice(2)[0] || process.env.PORT || 9294,
    address, serverHostname, serverPort, serverLocation,

// Create Server
    server     = express.createServer({
      key: '', //fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: '', //fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    });

// Configure
server.configure(function() {
  'use strict';
  // Standard
  server.use(express.errorHandler());
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  
  // Routing
  server.use(server.router);
  server.use(express.static(publicPath));
  server.use(express.directory(publicPath));
});

// Listen
server.listen(port);

// Log
address = server.address();
serverHostname = address.address == '0.0.0.0' ? 'localhost' : address.address;
serverPort = address.port;
serverLocation = 'http://' + serverHostname + ':' + serverPort + '/';
console.log('Simple-Server listening to ' + serverLocation + ' with directory ' + publicPath);