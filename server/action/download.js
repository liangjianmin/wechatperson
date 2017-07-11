var moment = require('moment');
var http = require('http');
var request = require('request');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var pics = require('../models/pics');
var config = require('../wsconfig/tokenconfig.json');
var wechat = require('../util/wechat');
var wechatApp = new wechat(config);
var dir = path.join(__dirname + '/../../static/upload');


/*创建存储图片目录*/
mkdirp(dir, function (err) {
    if (err) {
        console.log(err);
    }
});

module.exports = function (app) {
    /*下载图片*/
    app.post('/upload', function (req, res, next) {
        wechatApp.getAccessToken().then(function (data) {
            var urlArr = [];//存放微信请求下载地址
            var medianame = req.body.url;//存放图片名字
            var openid = req.body.openid;  //存放用户的openid
            var x = 0;
            if (req.body.url.length > 0) {
                for (i = 0; i < req.body.url.length; i++) {
                    urlArr.push('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + data + '&media_id=' + req.body.url[i])
                }
                function getHttpReqCallback(imgSrc, dirName, index, flag, len) {
                    var fileName = index;
                    var callback = function (rescall) {
                        var contentLength = parseInt(rescall.headers['content-length']);
                        var fileBuff = [];
                        rescall.on('data', function (chunk) {
                            var buffer = new Buffer(chunk);
                            fileBuff.push(buffer);
                        });
                        rescall.on('end', function () {
                            if (isNaN(contentLength)) {
                                console.log(imgSrc + " content length error");
                                return;
                            }
                            var totalBuff = Buffer.concat(fileBuff);
                            if (totalBuff.length < contentLength) {
                                console.log(imgSrc + " download error, try again");
                                startDownloadTask(imgSrc, dirName, index, flag, len);
                                return;
                            }
                            fs.appendFile(dir + "/" + fileName + '.jpg', totalBuff, function (err) {
                                console.log('\n' + '保存成功：' + fileName);
                                x++;
                                console.log('flag：' + x);
                                if (x >= len) {
                                    pics.getPersonOperId(openid, function (data) {
                                        if (data.status && data.data.length > 0) {
                                            pics.updatePics({
                                                sql: "update wechat SET url=?,time=? WHERE openid = ?",
                                                params: [
                                                    medianame.join(','),
                                                    moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                                    openid
                                                ]
                                            }, function (data) {
                                                console.log('\n' + '更新数据库成功');
                                                res.send({status: true, msg: '上传成功', picid: openid})
                                            });
                                        } else {
                                            pics.savePics({
                                                data: {
                                                    openid: openid,
                                                    url: medianame.join(','),
                                                    time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                                                },
                                                sql: "INSERT INTO wechat SET ?"
                                            }, function (data) {
                                                if (data.status) {
                                                    console.log('\n' + '插入数据库成功');
                                                    res.send({status: true, msg: '上传成功', picid: openid})
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    };
                    return callback;
                }

                var startDownloadTask = function (imgSrc, dirName, index, flag, len) {
                    var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, index, flag, len));
                    req.on('error', function (e) {
                        startDownloadTask(imgSrc, dirName, index, flag, len);
                    });
                    req.end();
                }

                urlArr.forEach(function (item, index, array) {
                    startDownloadTask(item, './', medianame[index], index, urlArr.length);
                })
            }
        });
    });
};
