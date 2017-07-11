var pic = require('../models/pics');

module.exports = function (app) {
    app.get('/person', function (req, res, next) {
        var picid = req.query.picid;
        if (picid) {
            pic.getPersonOperId(picid,function (data) {
                if (data.status) {
                    res.send(data);
                } else {
                    res.send(500);
                }
            });
        }
    });
}