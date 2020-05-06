/**
 * date: 2017/5/16
 * author: wancheng
 * desc:
 */

'use strict';

const utils = require('../utils/index.js');
const _ = require('lodash');

const documents = [
    {
        name: "mock",
        title: "mock 平台使用手册",
        url: "/document/mock",
        version: "0.0.2"
    },
    {
        name:"nodeModules",
        title: "高质量 node组件",
        url:"/document/nodeModules",
        version: "0.0.1"
    },
    {
        name:"koaMiddleware",
        title: "高质量 koa 中间件",
        url:"/document/koaMiddleware",
        version: "0.0.1"
    }
];

exports.index = function (req, res) {

    let data = {
        title: '组件列表',
        docs: documents
    };
    res.render('documents', data);
};


exports.item = function (req, res) {
    const name = req.params.name;

    var data = {
        title: "",
        doc: ""
    };

    if (name) {

        const temp = _.find(documents, {name: name});

        if(temp){
            data.title = temp.title;
        }

        utils.getDocument(name, function (err, docHtml) {
            if (err) {
                console.error(err);
            }
            data.doc = docHtml;
            res.render('document', data);
        });
    }
    else {
        res.status(404).render('404.ejs', {
            title: '404',
        });
    }

};
