const mongoose = require('mongoose')
const config = require('config-lite')(__dirname)
// mongodb 连接🔗
//mongoose.connect('mongodb://username:password@host:port/database?options...');
mongoose.connect(config.mongodb)
// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})

module.exports = mongoose