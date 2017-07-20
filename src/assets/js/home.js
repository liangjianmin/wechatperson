module.exports = {
    init: function () {
        this.weather();
        this.tick();
    },
    timeshow: function (dates) {
        var str, colorhead, colorfoot;
        var yy = dates.getYear();
        if (yy < 1900) yy = yy + 1900;
        var MM = dates.getMonth() + 1;
        if (MM < 10) MM = '0' + MM;
        var dd = dates.getDate();
        if (dd < 10) dd = '0' + dd;
        var hh = dates.getHours();
        if (hh < 10) hh = '0' + hh;
        var mm = dates.getMinutes();
        if (mm < 10) mm = '0' + mm;
        var ss = dates.getSeconds();
        if (ss < 10) ss = '0' + ss;
        var ww = dates.getDay();
        if (ww == 0) colorhead = "";
        if (ww > 0 && ww < 6) colorhead = "";
        if (ww == 6) colorhead = "";
        if (ww == 0) ww = "星期日";
        if (ww == 1) ww = "星期一";
        if (ww == 2) ww = "星期二";
        if (ww == 3) ww = "星期三";
        if (ww == 4) ww = "星期四";
        if (ww == 5) ww = "星期五";
        if (ww == 6) ww = "星期六";
        colorfoot = ""
        str = colorfoot + colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + " " + ww;
        return (str);
    },
    tick: function () {
        var today, self = this;
        today = new Date();
        $(".time").html(this.timeshow(today));
        setTimeout(function () {
            self.tick();
        }, 1000)
    },
    weather: function () {
        var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
        $.getScript(cityUrl, function (script, textStatus, jqXHR) {
            var citytq = remote_ip_info.city;
            var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&day=0&dfc=3";
            $.ajax({
                url: url,
                dataType: "script",
                scriptCharset: "gbk",
                success: function (data) {
                    var _w = window.SWther.w[citytq][0];
                    var _f = _w.f1 + "_0.png";
                    if (new Date().getHours() > 17) {
                        _f = _w.f2 + "_1.png";
                    }
                    var img = "<img  width='16px' height='16px' src='http://i2.sinaimg.cn/dy/main/weather/weatherplugin/wthIco/20_20/" + _f
                        + "' />";
                    var tq = "温馨提示 : " + citytq + " " + img + " " + _w.s1 + " " + _w.t1 + "℃～" + _w.t2 + "℃ ";
                    $('.weather').html(tq);
                }
            });
        });
    }
}
