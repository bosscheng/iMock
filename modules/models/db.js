/**
 * date: 2017/5/4
 * author: wancheng(17033234)
 * desc: 数据库连接
 */


const mongoose = require('mongoose');
const config = require('../config/index.js');

const dbUrl = config.mongo_url;

mongoose.connect(dbUrl);

mongoose.connection.on('connected', function () {
    console.log('mongoose connection open to ' + dbUrl +' connected');
});


mongoose.connection.on('error', function (err) {
    console.error('mongoose connection error:', err);
});


mongoose.connection.on('disconnected', function () {
    console.log('mongoose connection disconnected');
});
