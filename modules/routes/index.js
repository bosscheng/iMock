/**
 * date: 2017/5/2
 * author: wancheng(17033234)
 * desc: 首页相关的处理【首页，搜索结果页面，】
 */
'use strict';

const path = require('path');

const mongoose = require('mongoose');
const _ = require('lodash');

const utils = require('../utils/index.js');
const config = require('../config/index.js');

function noop() {

}

function _handle404(req, res) {
    res.status(404).render('404.ejs', {
        title: '404',
        user: req.session.user
    });
}

const PAGE_SIZE = 10;
// 首页
// 搜索结果页面
// 异步搜索
// 类型查看
// 项目展示
// 编辑组件信息
// 更新组件信息
// 拉取用户信息
// demo 查看
// ajax
// 同步最新版本
// ajax get project versions
// 解除绑定
// 不同版本的项目
// 同步 package 里面的数据
// 主要获取 demo 数据，还有 package 里面的数据
// 拉取 project type
// 保存类型
