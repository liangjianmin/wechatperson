var mysqlDB = require("./mysqlDB.js");
var sql = null;
module.exports = {
    getPersonPic: function (picid, callback) {
        sql = "select * from wechat where id=" + picid;
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    getPersonOperId: function (openid, callback) {
        sql = "SELECT wechat.*,wsuser.nickname,wsuser.sex,wsuser.headimgurl FROM wechat,wsuser WHERE wechat.openid=wsuser.openid AND wechat.openid= '" + openid + "' ";
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    savePics: function (data, callback) {
        mysqlDB.insertTable(data, callback);
    },
    updatePics: function (data, callback) {
        mysqlDB.updateTable(data, callback)
    },
};
