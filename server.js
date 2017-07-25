// server.js
//var jsonServer = require('json-server')
//var jsonServer = require('./bin/index.js')
var jsonServer = require('./lib/server/index.js')
var server = jsonServer.create()
var middlewares = jsonServer.defaults()
var router = jsonServer.router('db.json')

server.use(middlewares)
server.use(router)
server.listen(3000, function () {
  console.log('JSON Server is running')
})