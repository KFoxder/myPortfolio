var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var app = express();
 

httpProxy.createProxyServer({target:'http://dev.markitondemand.com'}).listen(9090);

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 5000);