var crypto = require('crypto');
var https = require('https');
var util = require('util');
var fs = require('fs');
var urltil = require('url');
var accessTokenJson = require('../wsconfig/access_token.json');
var menus = require('./../wsconfig/menus');
var parseString = require('xml2js').parseString;
var msg = require('./msg');
var CryptoGraphy = require('./cryptoGraphy');

/**
 * 构建 WeChat 对象 即 js中 函数就是对象
 * @param {JSON} config 微信配置文件
 */
var WeChat = function (config) {
    //设置 WeChat 对象属性 config
    this.config = config;
    //设置 WeChat 对象属性 token
    this.token = config.token;
    //设置 WeChat 对象属性 appID
    this.appID = config.appID;
    //设置 WeChat 对象属性 appScrect
    this.appScrect = config.appScrect;
    //设置 WeChat 对象属性 apiDomain
    this.apiDomain = config.apiDomain;
    //设置 WeChat 对象属性 apiURL
    this.apiURL = config.apiURL;

    /**
     * 用于处理 https Get请求方法
     * @param {String} url 请求地址
     */
    this.requestGet = function (url) {
        return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                var buffer = [], result = "";
                //监听 data 事件
                res.on('data', function (data) {
                    buffer.push(data);
                });
                //监听 数据传输完成事件
                res.on('end', function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    //将最后结果返回
                    resolve(result);
                });
            }).on('error', function (err) {
                reject(err);
            });
        });
    }

    /**
     * 用于处理 https Post请求方法
     * @param {String} url  请求地址
     * @param {JSON} data 提交的数据
     */
    this.requestPost = function (url, data) {
        return new Promise(function (resolve, reject) {
            //解析 url 地址
            var urlData = urltil.parse(url);
            //设置 https.request  options 传入的参数对象
            var options = {
                //目标主机地址
                hostname: urlData.hostname,
                //目标地址 
                path: urlData.path,
                //请求方法
                method: 'POST',
                //头部协议
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data, 'utf-8')
                }
            };
            var req = https.request(options, function (res) {
                var buffer = [], result = '';
                //用于监听 data 事件 接收数据
                res.on('data', function (data) {
                    buffer.push(data);
                });
                //用于监听 end 事件 完成数据的接收
                res.on('end', function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    resolve(result);
                })
            })
            //监听错误事件
                .on('error', function (err) {
                    console.log(err);
                    reject(err);
                });
            //传入数据
            req.write(data);
            req.end();
        });
    }
}

/**
 * 微信接入验证
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.auth = function (req, res) {
    var that = this;
    this.getAccessToken().then(function (data) {
        //格式化请求连接
        var url = util.format(that.apiURL.createMenu, that.apiDomain, data);
        //使用 Post 请求创建微信菜单
        that.requestPost(url, JSON.stringify(menus)).then(function (data) {
            //讲结果打印
            console.log(data);
        });
    });
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
        nonce = req.query.nonce,//随机数
        echostr = req.query.echostr;//随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [this.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
}

/**
 * 获取微信 access_token
 */
WeChat.prototype.getAccessToken = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        //获取当前时间
        var currentTime = new Date().getTime();
        //格式化请求地址
        var url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);
        //判断 本地存储的 access_token 是否有效
        if (true) {
            that.requestGet(url).then(function (data) {
                var result = JSON.parse(data);
                if (data.indexOf("errcode") < 0) {
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    //更新本地存储的
                    fs.writeFile(__dirname + '/../wsconfig/access_token.json', JSON.stringify(accessTokenJson));
                    //将获取后的 access_token 返回
                    resolve(accessTokenJson.access_token);
                } else {
                    //将错误返回
                    resolve(result);
                }
            });
        } else {
            //将本地存储的 access_token 返回
            resolve(accessTokenJson.access_token);
        }
    });
}

/**
 * 微信消息处理
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.handleMsg = function (req, res) {
    var buffer = [], that = this;

    //实例微信消息加解密
    var cryptoGraphy = new CryptoGraphy(that.config, req);

    //监听 data 事件 用于接收数据
    req.on('data', function (data) {
        buffer.push(data);
    });
    //监听 end 事件 用于处理接收完成的数据
    req.on('end', function () {
        var msgXml = Buffer.concat(buffer).toString('utf-8');
        //解析xml
        parseString(msgXml, {explicitArray: false}, function (err, result) {
            if (!err) {
                result = result.xml;
                //判断消息加解密方式
                if (req.query.encrypt_type == 'aes') {
                    //对加密数据解密
                    result = cryptoGraphy.decryptMsg(result.Encrypt);
                }
                var toUser = result.ToUserName; //接收方微信
                var fromUser = result.FromUserName;//发送仿微信
                var reportMsg = ""; //声明回复消息的变量

                //判断消息类型
                if (result.MsgType.toLowerCase() === "event") {
                    //判断事件类型
                    switch (result.Event.toLowerCase()) {
                        case 'subscribe':
                            //回复消息
                            var content = "欢迎关注老衲的公众号\n\n";
                            content += "阿弥陀佛\n\n";
                            content += "回复以下数字：\n\n";
                            content += "1：获取你的法号\n\n";
                            content += "回复 “老司机”  一起跟老司机玩套路~\n\n";
                            content += "点击下面链接制作您的相册：\n";
                            content += "http://lianjianmintest.tunnel.echomod.cn";
                            reportMsg = msg.txtMsg(fromUser, toUser, content);
                            break;
                        case 'click':
                            var contentArr = [
                                {
                                    Title: "老司机便利店上演重庆森林",
                                    Description: "老司机便利店上演重庆森林",
                                    PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/dsjkd.webp",
                                    Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651911819&idx=1&sn=0a46ed06c014e99bd232572f102bb7dd&chksm=80a9556eb7dedc78bfd220b6bf2f9b01b330170494c2c418114f4f0e7e3206cee6d38df16655&mpshare=1&scene=1&srcid=0713gpzjhKEBgkWE2OqAcwUt#rd"
                                },
                                {
                                    Title: "老司机开车玩套路，后院起火被KO!",
                                    Description: "老司机开车玩套路，后院起火被KO!",
                                    PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/wqww.webp",
                                    Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651911956&idx=1&sn=d40fa1e69ce936d47f0f1245242192c4&chksm=80a954f1b7dedde7b0b0985b040741829460e5fe0fd581dec49513d65b621f9e355aa1660e50&mpshare=1&scene=1&srcid=0713gy1v5h7iEb8hFZylOiKL#rd"
                                },
                                {
                                    Title: "吓坏老司机，这可能是史上最牛逼的女司机",
                                    Description: "吓坏老司机，这可能是史上最牛逼的女司机",
                                    PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/h0398l.webp",
                                    Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651912621&idx=1&sn=e7121ca4fe0c06daa561de79f336b735&chksm=80a95a48b7ded35e62cb12ba103d225a61fa4ae4b83bd24a6ac46392f667ef6c1b38d333218f&mpshare=1&scene=1&srcid=0711dWT5NU4IPoMAncQ4wsiv#rd"
                                },
                                {
                                    Title: "亲我的变态，欢迎下次再来",
                                    Description: "亲我的变态，欢迎下次再来",
                                    PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/h039821.jpg",
                                    Url: "https://mp.weixin.qq.com/s?src=3&timestamp=1499737804&ver=1&signature=VQY*Z7g5ok9szjz-6difCOtsGmuQUdP37P4W70htRVUcQtdtca5OcfKVglwvSsDoxSJ6tZzNybaMrY5Cy6CZkYIZfAj8T0AuoTnk-r7SbsG5Fvu7xQ9YBl4Co819TQXusCQRzy0yi75aZ134iE3IBUFAKpW33ElkM-oXjpm2xA4="
                                }
                            ];
                            //回复图文消息
                            reportMsg = msg.graphicMsg(fromUser, toUser, contentArr);
                            break;
                    }
                } else {
                    //判断消息类型为 文本消息
                    if (result.MsgType.toLowerCase() === "text") {
                        //根据消息内容返回消息信息
                        switch (result.Content) {
                            case '1':
                                reportMsg = msg.txtMsg(fromUser, toUser, '你的法号是八戒');
                                break;
                            case '老司机':
                                var contentArr = [
                                    {
                                        Title: "老司机便利店上演重庆森林",
                                        Description: "老司机便利店上演重庆森林",
                                        PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/dsjkd.webp",
                                        Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651911819&idx=1&sn=0a46ed06c014e99bd232572f102bb7dd&chksm=80a9556eb7dedc78bfd220b6bf2f9b01b330170494c2c418114f4f0e7e3206cee6d38df16655&mpshare=1&scene=1&srcid=0713gpzjhKEBgkWE2OqAcwUt#rd"
                                    },
                                    {
                                        Title: "老司机开车玩套路，后院起火被KO!",
                                        Description: "老司机开车玩套路，后院起火被KO!",
                                        PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/wqww.webp",
                                        Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651911956&idx=1&sn=d40fa1e69ce936d47f0f1245242192c4&chksm=80a954f1b7dedde7b0b0985b040741829460e5fe0fd581dec49513d65b621f9e355aa1660e50&mpshare=1&scene=1&srcid=0713gy1v5h7iEb8hFZylOiKL#rd"
                                    },
                                    {
                                        Title: "吓坏老司机，这可能是史上最牛逼的女司机",
                                        Description: "吓坏老司机，这可能是史上最牛逼的女司机",
                                        PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/h0398l.webp",
                                        Url: "https://mp.weixin.qq.com/s?__biz=MzAxMDY1NTM3MA==&mid=2651912621&idx=1&sn=e7121ca4fe0c06daa561de79f336b735&chksm=80a95a48b7ded35e62cb12ba103d225a61fa4ae4b83bd24a6ac46392f667ef6c1b38d333218f&mpshare=1&scene=1&srcid=0711dWT5NU4IPoMAncQ4wsiv#rd"
                                    },
                                    {
                                        Title: "亲我的变态，欢迎下次再来",
                                        Description: "亲我的变态，欢迎下次再来",
                                        PicUrl: "http://lianjianmintest.tunnel.echomod.cn/images/h039821.jpg",
                                        Url: "https://mp.weixin.qq.com/s?src=3&timestamp=1499737804&ver=1&signature=VQY*Z7g5ok9szjz-6difCOtsGmuQUdP37P4W70htRVUcQtdtca5OcfKVglwvSsDoxSJ6tZzNybaMrY5Cy6CZkYIZfAj8T0AuoTnk-r7SbsG5Fvu7xQ9YBl4Co819TQXusCQRzy0yi75aZ134iE3IBUFAKpW33ElkM-oXjpm2xA4="
                                    }
                                ];
                                //回复图文消息
                                reportMsg = msg.graphicMsg(fromUser, toUser, contentArr);
                                break;
                            default:
                                var tx = ['洗澡中，请勿打扰，偷窥请购票，个体四十，团体八折，订票电话：一般人我不告诉他！', '你慢慢说，别急', '你要和我说话？', '你真的要和我说话？', '主人出去了，你稍等哈', '这是自动回复', '你是谁？', '你没发错吧？'];
                                var txlen = Math.floor(Math.random() * tx.length)
                                reportMsg = msg.txtMsg(fromUser, toUser, tx[txlen]);
                                break;
                        }
                    }
                }
                //判断消息加解密方式，如果未加密则使用明文，对明文消息进行加密
                reportMsg = req.query.encrypt_type == 'aes' ? cryptoGraphy.encryptMsg(reportMsg) : reportMsg;
                //返回给微信服务器
                res.send(reportMsg);

            } else {
                //打印错误
                console.log(err);
            }
        });
    });
}

module.exports = WeChat;