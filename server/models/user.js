var mysqlDB = require("./mysqlDB.js");
var sql = null;
module.exports = {
    getUsers: function (callback) {
        sql = "select * from wsuser";
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    getUser: function (openid, callback) {
        sql = "select * from wsuser WHERE openid= '" + openid + "' ";
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    saveUser: function (data, callback) {
        mysqlDB.insertTable(data, callback);
    },
};
