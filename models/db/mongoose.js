const mongoose = require('mongoose')

// mongodb 连接🔗
mongoose.connect('mongodb://localhost:27017/mate')
// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})

module.exports = mongoose