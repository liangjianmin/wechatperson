var config = require('../wsconfig/tokenconfig.json');
var user = require('../models/user');
var request = require('request');
var moment = require('moment');
var pics = require('../models/pics');

module.exports = function (app) {
    /**
     *  微信网页授权
     *  设置回调地址get_wx_access_token
     */
    app.get('/wx_login', function (req, res, next) {
        var router = 'get_wx_access_token';
        var return_uri = 'http://lianjianmintest.tunnel.echomod.cn/' + router;
        var scope = 'snsapi_userinfo';
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appID + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect';
        res.send({data: url, status: true})
    });

    /**
     * 获取登录access_token
     */
    app.get('/get_wx_access_token', function (req, res, next) {
        // 通过code换取网页授权access_token
        var code = req.query.code;
        request.get({
                url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.appID + '&secret=' + config.appScrect + '&code=' + code + '&grant_type=authorization_code',
            }, function (error, response, body) {
                if (response.statusCode == 200) {
                    // 拉取用户信息(需scope为 snsapi_userinfo)
                    var data = JSON.parse(body);
                    var access_token = data.access_token;
                    var openid = data.openid;
                    console.log('openid：' + openid);
                    request.get({
                            url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
                        }, function (error, response, body) {
                            if (response.statusCode == 200) {
                                var userinfo = JSON.parse(body);
                                var userfalg = true; // 标志用户是否注册
                                req.session.openid = userinfo.openid; //opid保存在session
                                user.getUsers(function (data) {
                                    if (data.status) {
                                        for (let i = 0; i < data.data.length; i++) {
                                            if (userinfo.openid == data.data[i].openid) {
                                                userfalg = false;
                                                res.redirect('http://lianjianmintest.tunnel.echomod.cn/#/home?openid=' + userinfo.openid);
                                                break;
                                            }
                                        }
                                    }
                                    if (userfalg) {
                                        user.saveUser({
                                            data: {
                                                openid: userinfo.openid,
                                                nickname: userinfo.nickname,
                                                sex: userinfo.sex,
                                                headimgurl: userinfo.headimgurl,
                                                time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                                            },
                                            sql: "INSERT INTO wsuser SET ?"
                                        }, function (data) {
                                            if (data.status) {
                                                res.redirect('http://lianjianmintest.tunnel.echomod.cn/#/home?openid=' + userinfo.openid);
                                            }
                                        });
                                    }
                                })
                            } else {
                                console.log(response.statusCode);
                            }
                        }
                    );
                } else {
                    console.log(response.statusCode);
                }
            }
        );
    });

    /**
     * 获取用户信息
     */
    app.post('/getAuthinfo', function (req, res, next) {
        var openid = req.body.openid;
        if (openid) {
            pics.getPersonOperId(openid,function (data) {
                if(data.data !='' && data.data[0].url.length > 0){
                    res.send(data);
                }else{
                    user.getUser(openid, function (data) {
                        if (data.status) {
                            res.send(data);
                        }
                    })
                }
            })
        }
    });
    /**
     * 获取用户session
     */
    app.post('/getSession', function (req, res, next) {
        console.log('session：' + req.session.openid)
        var openid=req.session.openid;
        if (openid) {
            pics.getPersonOperId(openid,function (data) {
                if (data.status && data.data.length > 0) {
                    res.send({dataid:data.data[0].id,openid:openid,status:true});
                } else {
                    res.send({openid:openid,status:true});
                }
            });
        }else{
            res.send({status:false});
        }
    });

}