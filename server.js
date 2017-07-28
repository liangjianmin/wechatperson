var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var fs = require('fs');
var crypto = require('crypto');
var routes = require('./server/routes/index');
var wechat = require('./server/util/wechat');
var config = require('./server/wsconfig/tokenconfig.json');
var app = express();

var wechatApp = new wechat(config); //实例wechat 模块

//用于处理所有进入 80 端口 get 的连接请求
/*app.get('/',function(req,res){
    wechatApp.auth(req,res);
});*/

//用于处理所有进入 80 端口 post 的连接请求
app.post('/', function (req, res) {
    wechatApp.handleMsg(req, res);
});

// view engine setup
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

//设置跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.sendStatus(200);
    else  next();
});

//中间件定义
app.use(favicon("./favicon.ico"))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'appuser',
    name: 'user',
    cookie: {maxAge: 3600000 * 24 * 30},
    resave: false,
    saveUninitialized: true
}));

//静态资源
app.use(express.static(path.join(__dirname, './static')));

routes(app);

app.get('*', function (req, res) {
    res.render('404.html', {
        title: 'No Found'
    })
});

app.listen(80, function () {
    console.log('listen 80')
});


