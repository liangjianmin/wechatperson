var request = require('request');
var cache = require('memory-cache');
var sha1 = require('sha1');
var config = require('../wsconfig/ticket.json');

exports.sign = function (url, callback) {
    var noncestr = config.wechat.noncestr;
    var timestamp = Math.floor(Date.now() / 1000);
    var jsapi_ticket;
    if (cache.get('ticket')) {
        jsapi_ticket = cache.get('ticket');
        callback({
            noncestr: noncestr,
            timestamp: timestamp,
            url: url,
            jsapi_ticket: jsapi_ticket,
            signature: sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
        });
    } else {
        request(config.wechat.accessTokenUrl + '?grant_type=' + config.wechat.grant_type + '&appid=' + config.wechat.appid + '&secret=' + config.wechat.secret, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var tokenMap = JSON.parse(body);
                request(config.wechat.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function (error, resp, json) {
                    if (!error && response.statusCode == 200) {
                        var ticketMap = JSON.parse(json);
                        cache.put('ticket', ticketMap.ticket, config.cache_duration);
                        callback({
                            noncestr: noncestr,
                            timestamp: timestamp,
                            url: url,
                            jsapi_ticket: ticketMap.ticket,
                            signature: sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                        });
                    }
                })
            }
        })
    }
}