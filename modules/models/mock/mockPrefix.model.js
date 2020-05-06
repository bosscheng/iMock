/**
 * date: 2017/5/31
 * author: wancheng
 * desc: mock url 前缀(分类)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MockPrefixSchema = new Schema({
    name: {type: String, require: true}, //前缀的名称
    description:{type: String, require: false}, // 描述
    createdAt: {type: Date, default: Date.now}, // 添加时间
    updatedAt: {type: Date, default: Date.now} // 修改时间
});

// 创建 model
module.exports = mongoose.model('MockPrefix', MockPrefixSchema);
