#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var pump = require('pump');
var requestStats = require('request-stats');
var prettyBytes = require('pretty-bytes');

var server = http.createServer(function (req, res) {
  pump(fs.createReadStream('/dev/urandom'), res);
}).listen(madness);

requestStats(server, function (stats) {
  var size = prettyBytes(stats.res.bytes);
  var avg = prettyBytes(stats.res.bytes / (stats.time / 1000));
  console.log('Downloaded %s at %s/s', size, avg);
});

function madness() {
  var req = http.get('http://localhost:' + server.address().port, function (res) {
    pump(res, fs.createWriteStream('/dev/null'));
    setTimeout(function () {
      req.abort();
      process.nextTick(madness);
    }, Math.random() * 500);
  });
}
