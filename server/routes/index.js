var wechatconfig = require('../wsconfig/ticket.json');
var signature = require('../util/signature');
var dowm = require('../action/download');
var person = require('../action/person');
var login = require('../action/login');


module.exports = function (app) {

    /*获取jsapi_ticket*/
    app.get('/', function (req, res, next) {
        var url = req.protocol + '://' + req.hostname + req.originalUrl;
        signature.sign(url, function (signatureMap) {
            signatureMap.appId = wechatconfig.wechat.appid;
            res.render('index', signatureMap);
        });
    });



    /*装载路由*/
    dowm(app);
    person(app);
    login(app);
};
