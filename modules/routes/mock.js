/**
 * date: 2017/5/23
 * author: wancheng
 * desc:mock 平台 api
 */

'use strict';

const mongoose = require('mongoose');

const _ = require('lodash');
const moment = require('moment');
const Mock = require('mockjs');


require('../models/mock/mock.model');
require('../models/mock/mockHistory.model');
require('../models/mock/mockPrefix.model');


const PAGE_SIZE = 10;

function _search(query, onlyPrefix, callback) {
    callback = callback || noop;
    //
    const MockModel = mongoose.model('Mock');
    // 全局查询
    MockModel.find(function (err, doc) {
        doc = doc || [];

        let arg = [];
        _.each(doc, function (item) {
            if (_contains(item, query, onlyPrefix)) {
                arg.push(item);
            }
        });

        callback(null, arg);
    });

    // 主要对比 两个对象
    // title 和 description
    function _contains(obj, keys, onlyPrefix) {
        let result = false;

        let url = (obj.url || '').toLowerCase();
        let description = (obj.description || '').toLowerCase();
        let prefix = obj.prefix;

        let num = 0;
        _.each(keys, function (key) {
            if (onlyPrefix) {
                if (prefix === key) {
                    num = num + 1;
                }
            }
            else {
                if (url.indexOf(key) !== -1 || description.indexOf(key) !== -1 || prefix.indexOf(key) !== -1) {
                    num = num + 1;
                }
            }

        });

        result = num === keys.length;
        return result;
    }
}


function _searchPrefix(query, callback) {
//
    const MockPrefixModel = mongoose.model('MockPrefix');
    // 全局查询
    MockPrefixModel.find(function (err, doc) {
        doc = doc || [];

        let arg = [];
        _.each(doc, function (item) {
            if (_contains(item, query)) {
                arg.push(item);
            }
        });

        callback(null, arg);
    });

    // 主要对比 两个对象
    // title 和 description
    function _contains(obj, keys, onlyPrefix) {
        let result = false;

        let name = (obj.name || '').toLowerCase();
        let description = (obj.description || '').toLowerCase();

        let num = 0;
        _.each(keys, function (key) {
            if (name.indexOf(key) !== -1 || description.indexOf(key) !== -1) {
                num = num + 1;
            }
        });

        result = num === keys.length;
        return result;
    }
}

function _history(data) {
    const MockHistoryModel = mongoose.model('MockHistory');

    MockHistoryModel.create(data, function (err, doc) {
        if (err) {
            console.error(err);
        }
    });
}

function noop() {
}

function _handle404(req, res) {
    res.status(404).render('404.ejs', {
        title: '404',
    });
}

// 列表页面，支持搜索
exports.index = function (req, res) {
    let page = req.query.page || 1;

    let data = {
        title: "mock 列表",
        mocks: [],
        pager: {
            total: 0,
            page: 1,
            totalPage: 1
        }
    };

    const MockModel = mongoose.model('Mock');
    const MockPrefixModel = mongoose.model('MockPrefix');

    MockModel.count({}, function (err, count) {
        if (err) {

        }
        //
        data.pager.total = count;
        data.pager.page = page; // 当前页数
        let totalPage = parseInt(count / PAGE_SIZE, 10);
        if (count % PAGE_SIZE) {
            totalPage += 1;
        }
        data.pager.totalPage = totalPage;

        if (page > totalPage) {
            data.pager.page = totalPage;
        }

        let skip = (data.pager.page - 1) * PAGE_SIZE;

        // 查询所有
        MockModel.find({}, null, {sort: {"_id": -1}, skip: skip, limit: PAGE_SIZE}, function (err, doc) {
            doc = doc || [];

            // 需要更新 prefix 的描述信息。

            MockPrefixModel.find(function (err, prefixs) {
                doc.forEach(function (d) {
                    if (d.prefix) {
                        let tempDesc = _.find(prefixs, {name: d.prefix});

                        if (tempDesc) {
                            d.prefixDescription = tempDesc.description;
                        }
                    }

                });
                data.mocks = doc;
                res.render('mock', data);
            });
        });
    });


};
// 搜索
exports.search = function (req, res) {
    let query = (req.query.q || '').split(' ');
    let onlyPrefix = req.query.prefix == 1;
    query = _.compact(query);
    let data = {
        title: "mock 列表",
        mocks: [],
        pager: {
            total: 0,
            page: 1,
            totalPage: 1
        },
        q: req.query.q
    };

    _search(query, onlyPrefix, function (err, doc) {
        if (err) {
            console.error('mock-search, param %s ,err %s', req.query.q, err);
        }

        doc = doc || [];
        data.mocks = doc;
        res.render('mock', data);
    });
};
// 新建页面
exports._new = function (req, res) {

    let data = {
        title: "",
    };

    res.render('mock-new', data);
};
// 创建 数据
exports.create = function (req, res) {

    const method = req.body.method;
    const url = req.body.url;
    const description = req.body.description;
    const requires = req.body.requires;
    const response = req.body.response;
    const type = req.body.type;
    const prefix = req.body.prefix;

    let data = {
        method: method || 'GET',
        url: url,
        prefix: prefix,
        description: description || '',
        requires: requires,
        response: response,
        type: type,
    };

    // 请求参数
    if (requires) {
        let tempRequire = JSON.parse(requires);
        let tempArray = [];
        for (let p in tempRequire) {
            let tempP = {
                name: p,
                desc: tempRequire[p],
                type: 'String',
                isNeed: false
            };
            tempArray.push(tempP);
        }
        let t1 = {'data': tempArray};
        data.requires = JSON.stringify(t1);
    }

    // 将分类存储起来
    if (prefix) {
        _savePrefix({name: prefix});
    }


    const MockModel = mongoose.model('Mock');
    MockModel.create(data, function (err, doc) {
        if (err) {
            console.error('mock.js create, err: %s', err);
        }

        //
        data.bindId = doc._id;
        _history(data);

        res.redirect('/mock/show/' + doc._id);
    });

};
// 编辑 数据
exports.edit = function (req, res) {
    const _id = req.params.id;


    let data = {
        title: "mock详情",
        mock: {}
    };

    if (_id) {
        // 从数据库中查询package
        const MockModel = mongoose.model('Mock');

        MockModel.findById(_id, function (err, adventure) {
            if (err) {
                console.error(err);
            }
            else {
                let temp = (adventure && adventure._doc) || {};

                if (temp) {
                    data.mock = temp;

                    // 需要讲 入口参数格式化掉
                    if (temp.requires) {
                        let tempReq = JSON.parse(temp.requires);
                        data.mock.requires = (tempReq && tempReq.data) || [];
                    }

                    res.render('mock-edit', data);
                }
            }
        })
    }
    else {
        _handle404(req, res);
    }
};
// update 更新
exports.update = function (req, res) {
    const method = req.body.method;
    const url = req.body.url;
    const description = req.body.description;
    const requires = req.body.requires;
    const response = req.body.response;
    const type = req.body.type;
    const id = req.body.id;
    const prefix = req.body.prefix;

    let data = {
        method: method,
        url: url,
        description: description || '',
        requires: requires,
        response: response,
        type: type,
        updatedAt: Date.now(),
        prefix: prefix
    };

    // 修改数据
    if (id) {

        // 将分类存储起来
        if (prefix) {
            _savePrefix({name: prefix});
        }


        const MockModel = mongoose.model('Mock');
        //
        MockModel.findByIdAndUpdate(id, {$set: data}, function (err, doc) {
            if (err) {
                console.error('', err);
            }

            res.redirect('/mock/show/' + doc._id);
        });

        data.bindId = id;
        _history(data);
    }
};
// 删除
exports.delete = function (req, res) {
    let id = req.body.id;

    let result = {
        error: "",
        data: ""
    };


    if (id) {
        const MockModel = mongoose.model('Mock');
        MockModel.findByIdAndRemove(id, function (err, doc) {
            if (err) {
                result.error = err;
            }
            res.status(200).send(result);
        })
    }
    else {
        result.error = 'argument is required';
        res.status(200).send(result);
    }


};
// 详情
exports.show = function (req, res) {
    const _id = req.params.id;

    let data = {
        title: "mock详情",
        mock: {}
    };


    if (_id) {
        // 从数据库中查询package
        const MockModel = mongoose.model('Mock');

        MockModel.findById(_id, function (err, adventure) {
            if (err) {
                console.error(err);
            }
            else {
                let temp = (adventure && adventure._doc) || {};

                if (temp) {
                    data.mock = temp;

                    // 需要讲 入口参数格式化掉
                    if (temp.requires) {
                        data.mock.requiresStr = temp.requires;
                        let tempReq = JSON.parse(temp.requires);
                        data.mock.requires = (tempReq && tempReq.data) || [];
                    }

                    res.render('mock-show', data);
                }
            }
        })
    }
    else {
        // 404
        _handle404(req, res);
    }
};
// 分类列表
exports.prefix = function (req, res) {
    let page = req.query.page || 1;

    let data = {
        title: "mock 分类列表",
        mockPrefix: [],
        pager: {
            total: 0,
            page: 1,
            totalPage: 1
        }
    };
    const MockPrefixModel = mongoose.model('MockPrefix');

    MockPrefixModel.count({}, function (err, count) {
        if (err) {

        }
        //
        data.pager.total = count;
        data.pager.page = page; // 当前页数
        let totalPage = parseInt(count / PAGE_SIZE, 10);
        if (count % PAGE_SIZE) {
            totalPage += 1;
        }
        data.pager.totalPage = totalPage;

        if (page > totalPage) {
            data.pager.page = totalPage;
        }

        let skip = (data.pager.page - 1) * PAGE_SIZE;

        // 查询所有
        MockPrefixModel.find({}, null, {skip: skip, limit: PAGE_SIZE}, function (err, doc) {
            doc = doc || [];
            data.mockPrefix = doc;
            res.render('mock-prefix', data);
        });
    });
};

// 搜索
exports.searchPrefix = function (req, res) {
    let query = (req.query.q || '').split(' ');
    query = _.compact(query);
    let data = {
        title: "mock 分类列表",
        mockPrefix: [],
        pager: {
            total: 0,
            page: 1,
            totalPage: 1
        },
        q: req.query.q
    };

    _searchPrefix(query, function (err, doc) {
        if (err) {
            console.error('mock-search, param %s ,err %s', req.query.q, err);
        }

        doc = doc || [];
        data.mockPrefix = doc;
        res.render('mock-prefix', data);
    });
};

// ajax
exports.createPrefix = function (req, res) {
    const name = req.body.name;
    const description = req.body.description;

    let data = {
        name: name,
        description: description
    };

    _savePrefix(data, function (err) {
        var result = {
            error: err,
        };
        res.status(200).send(result);
    });
};
// ajax
exports.updatePrefix = function (req, res) {
    const id = req.body.id;
    const description = req.body.description;
    let data = {
        id: id,
        description: description,
    };

    _updatePrefix(data, function (err, doc) {
        var result = {
            error: err,
        };

        //
        result.update = {
            updatedBy: doc.updatedBy,
            updatedByZh: doc.updatedByZh,
            updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
        };

        res.status(200).send(result);
    });
};

// ajax 删除
exports.deletePrefix = function (req, res) {

};

// ajax 校验
exports.valid = function (req, res) {
    let url = req.query.url;
    const _id = req.query.id;
    const method = req.query.method;
    const prefix = req.query.prefix || '';// 前缀

    let result = true;
    if (url) {

        // 从数据库中查询package
        const MockModel = mongoose.model('Mock');
        //
        MockModel.find({url: url, method: method}, function (err, doc) {
            doc = doc || [];
            //
            if (doc && doc.length > 0) {
                // 循环
                for (var i = 0, len = doc.length; i < len; i++) {
                    const temp = doc[i];
                    let tempUrl = temp.url;

                    if (temp.prefix) {
                        tempUrl = temp.prefix + '/' + temp.url;
                    }

                    if (prefix) {
                        url = prefix + '/' + url;
                    }

                    if (tempUrl == url && ((_id && temp._id !== _id) || !_id)) {
                        result = false;
                        break;
                    }
                }
            }
            res.status(200).send(result);
        })
    }
    else {
        res.status(200).send(result);
    }

};
//ajax 流水表
exports.asyncHistoryList = function (req, res) {
    const id = req.params.id;

    var result = {
        error: "",
        data: []
    };
    if (id) {
        const MockHistoryModel = mongoose.model('MockHistory');
        MockHistoryModel.find({bindId: id}, function (err, docs) {
            if (err) {
                result.error = err;
            }

            docs = docs || [];

            var hs = [];
            docs.forEach(function (item) {
                let tempI = {
                    createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
                    _id: item._id
                };
                hs.push(tempI);
            });

            result.data = hs;

            res.status(200).send(result);
        })

    }
    else {
        result.error = 'id 不能为空';
        res.status(200).send(result);
    }
};
//  ajax 流水详情
exports.asyncHistory = function (req, res) {
    const id = req.params.id;
    var result = {
        error: "",
        data: {}
    };


    if (id) {
        const MockHistoryModel = mongoose.model('MockHistory');
        MockHistoryModel.findById(id, function (err, adventure) {
            if (err) {
                result.error(err);
            }

            let temp = (adventure && adventure._doc) || {};

            if (temp) {
                result.data = temp;
                // 需要讲 入口参数格式化掉
                if (temp.requires) {
                    result.data.requiresStr = temp.requires;
                    let tempReq = JSON.parse(temp.requires);
                    result.data.requires = (tempReq && tempReq.data) || [];
                }
                res.status(200).send(result);
            }
        })
    }
    else {
        result.error = 'id 不能为空';
        res.status(200).send(result);
    }
};

// ajax 前缀列表
exports.asyncPrefixList = function (req, res) {
    const MockPrefix = mongoose.model('MockPrefix');
    let result = {
        error: "",
        data: ""
    };

    MockPrefix.find(function (err, doc) {
        doc = doc || [];

        if (err) {
            result.error = err;
        }
        result.data = doc;

        res.status(200).send(result);
    })
};

// api 接口返回
exports.api = function (req, res) {
    // 请求url
    let reqUrl = req.params[0];

    let query = req.query;

    let temp = null;
    if (reqUrl) {

        // 从数据库中查询package
        const MockModel = mongoose.model('Mock');
        //
        MockModel.find(function (err, doc) {
            if (err) {
                console.error('', err);
            }

            for (let i = 0, len = doc.length; i < len; i++) {
                let item = doc[i];

                let resultUrl = item.url;
                if (item.prefix) {
                    resultUrl = item.prefix + '/' + item.url;
                }

                if (resultUrl === reqUrl) {
                    temp = item;
                    break;
                }
            }


            if (temp) {
                if (temp._doc) {
                    temp = temp._doc;
                }

                // 校验入参是否合法
                let isBadRequest = false;
                let errorMsg = '原因：\r';
                if (temp.requires) {
                    let tempRequires = (JSON.parse(temp.requires)) || {};
                    let requires = tempRequires.data || [];

                    for (let i = 0, len = requires.length; i < len; i++) {
                        let tempR = requires[i];
                        // 如果必填
                        if (tempR.isNeed === true || tempR.isNeed === 'true') {
                            if (!(query && query[tempR.name])) {
                                isBadRequest = true;
                                let tempMsg = tempR.name + ' 为必填项，不能为空 \r';
                                errorMsg += tempMsg;
                            }
                        }
                        // 参数类型校验
                        if ((query && query[tempR.name])) {
                            const queryR = query[tempR.name];
                            const reqType = tempR.type;
                            // if int require ?
                            if (reqType == 'Int' && !(_.toNumber(queryR) == queryR)) {
                                isBadRequest = true;
                                let tempMsg = tempR.name + ' 类型错误，要求类型是 Int, 传参为: ' + queryR + '\r';
                                errorMsg += tempMsg;
                            }
                        }
                    }
                }
                //
                if (isBadRequest) {
                    res.status(400).send('bad request \r' + errorMsg);
                }
                else {
                    if (temp.type === 'JSON') {

                        let tempRes = {};

                        try {
                            tempRes = JSON.parse(temp.response);
                        }
                        catch (e) {
                            console.error('mock.js->api,JSON parse:', e);
                        }

                        try {
                            tempRes = Mock.mock(tempRes);
                        }
                        catch (e) {
                            console.error('mock.js->api,JSON mock:', e);
                        }

                        res.json(tempRes);
                    }
                    else if (temp.type === 'JSONP') {
                        let tempResponse = temp.response;

                        try {
                            tempResponse = JSON.parse(temp.response);
                        }
                        catch (e) {
                            console.error('mock.js->api,JSONP Parse:', e);
                        }

                        try {
                            tempResponse = Mock.mock(tempResponse);
                        }
                        catch (e) {
                            console.error('mock.js->api,JSONP mock:', e);
                        }


                        res.jsonp(tempResponse);
                    }
                    else {

                        let tempR = temp.response;

                        try {
                            tempR = Mock.mock(tempR);
                        }
                        catch (e2) {
                            console.error('mock.js->api,text mock:', e);
                        }

                        res.send(tempR);
                    }
                }
            }
            else {
                res.status(404).send('404！');
            }
        })
    }
    else {
        res.status(404).send('404！');
    }
};


function _savePrefix(param, callback) {
    callback = callback || noop;
    const MockPrefix = mongoose.model('MockPrefix');

    let para = {
        name: param.name || '',
        description: param.description || ''
    };


    MockPrefix.find({name: para.name}, function (err, doc) {
        doc = doc || [];
        if (err) {
            console.error(err);
            callback(err)
        }

        if (!(doc && doc.length > 0)) {
            let data = {
                name: para.name,
                description: para.description,
            };
            MockPrefix.create(data, function (e, d) {
                if (e) {
                    console.error(e);
                    callback(e);
                }
                else {
                    callback();
                }
            });
        }
        else {
            callback('标题已经存在！');
        }
    });
}


function _updatePrefix(param, callback) {
    callback = callback || noop;
    const MockPrefix = mongoose.model('MockPrefix');
    const id = param.id;

    let data = {
        description: param.description || '',
        updatedAt: Date.now(),
    };

    MockPrefix.findByIdAndUpdate(id, {$set: data}, function (err, doc) {
        if (err) {
            console.error(err);
            callback(err);
        }
        else {
            callback(null, data);
        }
    })
}



