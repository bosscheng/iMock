# mock 平台使用手册

主要介绍mock 平台的使用方式

## 首页
![image](/assets/img/doc/mock/mock-1.png)

## 搜索
![image](/assets/img/doc/mock/mock-2.png)

## 新建

在登录之后可以新建接口 点击![image](/assets/img/doc/mock/mock-3.png) 按钮

新建页面
![image](/assets/img/doc/mock/mock-4.png)

其中包含字段：
- method 方法类型（get/post）
- URL（必填）
- 描述
- 接口入参
- 接口返回数据（必填）

需要注意的是： 在新建接口的时候，对于 接口入参的填写，为了优化交互，所以在创建的时候，没有让用户的填写过多数据
只需要填写：key 和 描述 两个字段 ![image](/assets/img/doc/mock/mock-5.png)
然后在修改的时候，可以补充完所有数据：
![image](/assets/img/doc/mock/mock-6.png)

对于 返回接口 数据 有三种类型选择 ： JSON(默认)、JSONP、TEXT
![image](/assets/img/doc/mock/mock-7.png)

在选择JSON格式的时候，是有格式校验的 必须是JSON 格式的数据，否则会在提交的时候 校验错误。
![image](/assets/img/doc/mock/mock-8.png)

在选择 JSONP的时候，可以是JSON 或者TEXT 类型的数据。但是请求参数里面必须得包含“callback”参数，用于回调使用。

各种数据类型的返回测试

## JSON数据
![image](/assets/img/doc/mock/mock-9.png)

### mock.js 函数支持
![image](/assets/img/doc/mock/mock-15.png)

结果：
![image](/assets/img/doc/mock/mock-15-1.png)

ps: 具体函数详情见：http://mockjs.com/examples.html

## JSONP 数据
![image](/assets/img/doc/mock/mock-10.png)

### mock.js 支持
![image](/assets/img/doc/mock/mock-16.png)

结果：
![image](/assets/img/doc/mock/mock-16-1.png)
## TEXT
![image](/assets/img/doc/mock/mock-11.png)

### mock.js 支持
![image](/assets/img/doc/mock/mock-17.png)

结果：
![image](/assets/img/doc/mock/mock-17-1.png)

另外 对于每个接口的修改都会有流水记录
![image](/assets/img/doc/mock/mock-12.png)

记录了新建人，和最新修改人，点击“流水表”
![image](/assets/img/doc/mock/mock-13.png)

点击比较
![image](/assets/img/doc/mock/mock-14.png)
都会显示差异性的。


## 更新记录

- 2017/7/3 0.0.2
    1. mock 平台 支持 mock.js。

