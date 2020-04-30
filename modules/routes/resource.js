/**
 * date: 2017/5/11
 * author: wancheng(17033234)
 * desc: 组件demo 的静态资源下载
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const config = require('../config/index.js');
const utils = require('../utils/index.js');
// 拉取组件资源
exports.index = function (req, res) {
    //
    const pkg = req.params.package;
    //
    const pth = req.params[0];

    if (!pkg || !pth) {
        res.status(404).send();
        return;
    }

    // root path
    const rootPath = path.join(config.npm_install_url, 'node_modules', pkg);

    let lastIndex = pth.lastIndexOf('/');
    let filePath = pth.slice(0, lastIndex + 1);
    let fileName = pth.slice(lastIndex + 1);
    //
    let sourcePath = path.join(rootPath, filePath);
    // 如果资源存在
    if (fs.existsSync(path.join(sourcePath, fileName))) {
        var options = {
            root: sourcePath,
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.error('resource-index, fileName %s , error %s', fileName, err);
                res.status(err.status).end();
            }
        });
    }
    else {
        res.status(404).send();
    }
};

// 页面的预览
exports.preview = function (req, res) {
    let name = req.params.name;
    if (name) {
        // 拉取资源
        utils.getDemo(name, function (err, doc) {
            // 如果读取不到
            if (err) {
                console.error('resource-preview, param %s , error %s', name, err);
            }
            else {
                res.render('empty', {content: doc});
            }
        });
    }
};

// 运行 html 页面
exports.run = function (req, res) {
    let html = req.body.code;
    const pkg = req.body.package;
    html = utils.transformHtml(pkg, html);
    res.set('X-XSS-Protection', 0);
    res.render('empty', {content: html});
};
