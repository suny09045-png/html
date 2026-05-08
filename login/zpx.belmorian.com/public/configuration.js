function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var logo = "";
var global_title = "我的网站";
var global_appname = "MySite";
var global_skin = "default";
var global_downappurl = "";
var global_appversion = "1.0.0";
var global_isbalance = 1;
var global_iscurrency = 1;
var global_isintegral = 1;
var global_isdeposit = 1;
var global_balancename = "余额";
var global_currencyname = "积分";
var global_integralname = "金币";
var global_depositname = "储值";
var global_jumpurl = "";
var delivername1 = "送货上门";
var delivername2 = "到店自提";
var faretpname = "运费";
var withdrawal_name = "提现";
var pv_name = "PV";
var exp_name = "EXP";

var isvip = 1;
var isvip_month = 1;
var isvip_year = 1;
var isvip_forever = 1;
var isprebook = 1;
var isgroup = 1;
var isgroup_buying = 1;
var istrust = 1;

var global_regvcode = "";
var mid = GetQueryString("mid");
if (mid == null) {
    mid = "1";
}

function gotojump(url) {
    if (url.indexOf('?') >= 0) {
        window.parent.location.href = global_jumpurl + url + '&mid=' + mid;
    } else {
        window.parent.location.href = global_jumpurl + url + '?mid=' + mid;
    }
}
function jumpadmin(url) {
    if (url.indexOf('?') >= 0) {
        window.parent.location.href = "/mobadmin/" + url + '&mid=' + mid;
    } else {
        window.parent.location.href = "/mobadmin/" + url + '?mid=' + mid;
    }
}
function getpaytypename(paytypeid) {
    if (paytypeid == 1) {
        return global_balancename;
    }
    else if (paytypeid == 2) {
        return global_currencyname;
    }
    else if (paytypeid == 3) {
        return global_integralname;
    }
    else if (paytypeid == 4) {
        return "汇款支付";
    }
    else if (paytypeid == 5) {
        return "在线支付";
    }
    else if (paytypeid == 12) {
        return "账户支付";
    }
    return "未支付";
}

function x_admin_show(title, url, w, h) {
    if (title == null || title == '') {
        title = false;
    };
    if (url == null || url == '') {
        url = "404.html";
    };
    if (w == null || w == '') {
        w = ($(window).width() * 0.9);
    };
    if (h == null || h == '') {
        h = ($(window).height() - 50);
    };
    var tourl = "";
    if (url.indexOf("?") > -1) {
        tourl = url + '&mid=' + mid;
    }
    else {
        tourl = url + '?mid=' + mid;
    }

    if (typeof layer !== 'undefined') {
        layer.open({
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: false,
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: tourl
        });
    } else {
        window.open(tourl, title || '新窗口', 'width=' + w + ',height=' + h);
    }
}

document.title = global_title;
