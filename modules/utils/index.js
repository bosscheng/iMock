/**
 * date: 2017/5/2
 * author: wancheng
 * desc: utils
 */

'use strict';

const path = require('path');
//
const fs = require('fs-extra');
const marked = require('marked');
const _ = require('lodash');
const cheerio = require('cheerio');
//
const config = require('../config/index.js');

function noop() {
}

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});


var utils = {

    /**
     * @param url [String]
     * @desc
     *      格式化 url
     * @return object  {
     *                  protocol,
     *                  host,
     *                  port,
     *                  pathname,
     *                  search,
     *                  hash
     *                  }
     * */
    parseUrl: function (url) {
        // 校验检查
        if (!url || !_.isString(url)) {
            return {};
        }

        var r = {
            protocol: /([^\/]+:)\/\/(.*)/i,
            host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
            port: /\:?([^\/]*)(\/?.*)/,
            pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
        };

        var tmp, res = {};
        res["href"] = url;
        for (var p in r) {
            tmp = r[p].exec(url);
            res[p] = tmp[1];
            url = tmp[2];
            if (url === "") {
                url = "/";
            }
            if (p === "pathname") {
                res["pathname"] = tmp[1];
                res["search"] = tmp[2];
                res["hash"] = tmp[3];
            }
        }
        return res;
    },

    /**
     * @param name [string]
     * @param installUrl [string]
     * @param callback [function]
     * @desc
     *      获取 name 对应的 readme.md 文件里面的内容
     * @return  html string
     * */
    getReadme: function (name, installUrl, callback) {
        callback = callback || noop;
        if (!_.isFunction(callback)) {
            callback = noop;
        }

        if (!name) {
            callback('argument name is required');
            return;
        }

        if (!installUrl) {
            callback('argument installUrl is required');
            return;
        }


        let readmeUrl = path.join(installUrl, 'node_modules', name, 'README.md');

        if (!fs.existsSync(readmeUrl)) {
            callback("README.md 资源没有找到");
            return;
        }
        //
        fs.readFile(readmeUrl, 'utf-8', function (err, data) {
            if (err) {
                callback(err)
            }
            else {
                let mdHtml = marked(data.toString());
                callback(null, mdHtml);
            }
        })
    },

    /*
     * @param name [string]
     *
     * @return  html string
     * */
    getHistorySync: function (name) {
        let result = '';
        if (!name) {
            return result;
        }

        let readmeUrl = path.join(config.npm_install_url, 'node_modules', name, 'HISTORY.md');

        if (!fs.existsSync(readmeUrl)) {
            return result;
        }

        let fsContent = fs.readFileSync(readmeUrl, 'utf-8');

        result = marked(fsContent.toString());

        return result;
    },


    /**
     * @param name [string]
     * @param callback [function]
     * @desc  从目录的doc 文件夹中获取对应 name.md 文件的 html
     *
     * @return mdHtml [string]
     *
     * */
    getDocument: function (name, callback) {
        callback = callback || noop;

        if (!_.isFunction(callback)) {
            callback = noop;
        }

        if (!name) {
            callback('argument installUrl is required');
            return;
        }

        // 格式转换
        name = '' + name;

        var fileUrl = path.join('doc', name + '.md');
        if (!fs.existsSync(fileUrl)) {
            callback("资源没有找到");
            return;
        }
        //
        fs.readFile(fileUrl, 'utf-8', function (err, data) {
            if (err) {
                callback(err)
            }
            else {
                let mdHtml = marked(data.toString());
                callback(null, mdHtml);
            }
        })
    }
};

const _utils = utils;

module.exports = utils;
