/**
 * date: 2017/5/2
 * author: wancheng
 * desc:
 */


const _ = require('lodash');


module.exports = _.extend(
    {},
    require('../../config/config-base.js'),
    require('./config-exception.js'),
    require('./config-log.js'),
    require('./config-server.js'),
    require('./config-mongoDB.js'),
);
