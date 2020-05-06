/**
 * date: 2017/5/4
 * author: wancheng
 * desc:
 */

'use strict';

//
const localConfig = {
    development: 'mongodb://127.0.0.1:27017/mock',
    test: 'mongodb://127.0.0.1:27017/mock',
    prepare: 'mongodb://127.0.0.1:27017/mock',
    production: 'mongodb://127.0.0.1:27017/mock'
};

const env = process.env.NODE_ENV;

const config = {
    mongo_url: localConfig[env],

};

module.exports = config;
