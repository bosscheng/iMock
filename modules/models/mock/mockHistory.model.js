/**
 * date: 2017/5/26
 * author: wancheng
 * desc: mock 操作流水表
 */
/**
 * date: 2017/5/23
 * author: wancheng(17033234)
 * desc: mock 对象 流水表
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MockHistorySchema = new Schema({
    bindId: {type: String, require: true},// 绑定的id
    response: {type: String, require: true}, // 响应
    type: {type: String, require: true}, // 响应类型 json / jsonp /text
    requires: {type: String, require: false}, // 请求
    url: {type: String, require: true}, // url
    prefix:{type: String, require: false}, // 前缀 / 分类
    method: {type: String, require: true},// 方法（get,post）
    description: {type: String, require: false},// 描述
    createdAt: {type: Date, default: Date.now}, // 添加时间
});

// 创建 model
module.exports = mongoose.model('MockHistory', MockHistorySchema);
