#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var http = require('http');
var pump = require('pump');
var cow = require('cowsay');
var requestStats = require('request-stats');
var prettyBytes = require('pretty-bytes');

var server = http.createServer(function (req, res) {
  pump(fs.createReadStream('/dev/urandom'), res);
}).listen(madness);

requestStats(server, function (stats) {
  var size = prettyBytes(stats.res.bytes);
  var speed = prettyBytes(stats.res.bytes / (stats.time / 1000));
  var msg = util.format('Hi man! Fancy a beer? %s @ %s/s', size, speed);
  process.stdout.write('\x1b[2J\x1b[H' + cow.say({ text: msg, f: myCow }));
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

var myCow = process.argv[2] || ['beavis.zen','eyes','milk','stimpy','bong','flaming-sheep','moofasa','supermilker','bud-frogs','ghostbusters','moose','surgery','bunny','head-in','mutilated','telebears','cheese','hellokitty','ren','turkey','cower','kiss','satanic','turtle','daemon','kitty','sheep','tux','default','koala','skeleton','vader-koala','dragon-and-cow','kosh','small','vader','dragon','luke-koala','sodomized','www','elephant-in-snake','mech-and-cow','squirrel','elephant','meow','stegosaurus'][Math.random() * 45 | 0];
