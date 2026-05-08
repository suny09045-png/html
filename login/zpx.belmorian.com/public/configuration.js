function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]); return null;
}
var logo = "";
var global_title = "";
var global_appname = "";
var global_skin = "";
var global_downappurl = "";
var global_appversion = "";
var global_isbalance = "";//是否启用余额
var global_iscurrency = "";//是否启用虚拟币
var global_isintegral = "";//是否启用积分
var global_isdeposit = "";//是否启用储蓄金
var global_balancename = "";//零钱名称
var global_currencyname = "";//虚拟币名称
var global_integralname = "";//积分名称
var global_depositname = "";//储蓄金名称
var global_jumpurl = "";
var delivername1 = "送货上门";
var delivername2 = "到店自提";
var faretpname = "运费";
var withdrawal_name = "提现";
var pv_name = "PV";
var exp_name = "EXP";

var isvip = 0;
var isvip_month = 0;
var isvip_year = 0;
var isvip_forever = 0;
var isprebook = 0;
var isgroup = 0;
var isgroup_buying = 0;
var istrust = 0;

var global_regvcode = "";//注册验证码 0=关闭 1=开启
var mid = GetQueryString("mid");
if (mid == null) {
    window.parent.location.href = '/error.html';
}
$.ajax({
    type: "POST",
    async: false,  // 设置同步方式
    cache: false,
    url: "/user/systemconfig",
    data: { "token": "1", "mid": mid },
    dataType: "json",
    beforeSend: function () {

    },
    success: function (result) {

        if (eval(result).state == 1) {
            logo = eval(eval(result).info).logo;
            global_title = eval(eval(result).info).global_title;
            global_appname = eval(eval(result).info).global_appname;
            global_skin = eval(eval(result).info).global_skin;
            global_downappurl = eval(eval(result).info).global_downappurl;
            global_appversion = eval(eval(result).info).global_appversion;
            global_isbalance = eval(eval(result).info).global_isbalance;
            global_iscurrency = eval(eval(result).info).global_iscurrency;
            global_isintegral = eval(eval(result).info).global_isintegral;
            global_isdeposit = eval(eval(result).info).global_isdeposit;
            global_balancename = eval(eval(result).info).global_balancename;
            global_currencyname = eval(eval(result).info).global_currencyname;
            global_integralname = eval(eval(result).info).global_integralname;
            global_depositname = eval(eval(result).info).global_depositname;
            global_jumpurl = eval(eval(result).info).global_jumpurl;
            global_regvcode = eval(eval(result).info).global_regvcode;

            isvip = eval(eval(result).info).isvip;
            isvip_month = eval(eval(result).info).isvip_month;
            isvip_year = eval(eval(result).info).isvip_year;
            isvip_forever = eval(eval(result).info).isvip_forever;
            
            isprebook = eval(eval(result).info).isprebook;
            isgroup = eval(eval(result).info).isgroup;
            isgroup_buying = eval(eval(result).info).isgroup_buying;
            istrust = eval(eval(result).info).istrust;

            delivername1 = eval(eval(result).info).delivername1;
            delivername2 = eval(eval(result).info).delivername2;
            faretpname = eval(eval(result).info).faretpname;
            withdrawal_name = eval(eval(result).info).withdrawal_name;
            pv_name = eval(eval(result).info).pv_name;
            exp_name = eval(eval(result).info).exp_name;
           
            if (global_appversion.length >= 5) {
   
                window.fridge.actionFromVersion('' + global_appversion);//检测是否需要更新
            }
        }
        else {
            //window.parent.location.href = global_jumpurl + 'login.html?out=1';
        }

    }
});

document.title = global_title;

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

function actionJsVersion() {
    //需要更新提示
    layer.open({
        content: '检测到APP已发布新版本,建议您下载更新最新版本！'
        , btn: ['立即更新', '下次再说']
        , yes: function (index) {
            layer.close(index);
            location.href = global_downappurl;
        }
        , end: function () {//无论是确认还是取消，只要层被销毁了，end都会执行，不携带任何参数。layer.open关闭事件

        }
    });
}
/*弹出层*/
/*
    参数解释：
    title   标题
    url     请求的url
    id      需要操作的数据id
    w       弹出层宽度（缺省调默认值）
    h       弹出层高度（缺省调默认值）
*/
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

    layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        fix: false, //不固定
        maxmin: true,
        shadeClose: true,
        shade: 0.4,
        title: title,
        content: tourl
    });
}
