/**
 * date: 2017/5/2
 * author: wancheng
 * desc:
 */


'use strict';
const  config = {
    debug: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
};

module.exports = config;
