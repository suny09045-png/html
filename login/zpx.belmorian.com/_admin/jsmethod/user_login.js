
function setout(){
    if (GetQueryString("out") == 1) {
        //$.cookie('browsertoken', '', { expires: 1 });
        $.cookie('admin_token', '', { expires: 1, path: '/' });
    }
}
setout();
var mid = GetQueryString("mid");
function sub() {
    $('.loadingbar3').show();
    $(this).prop('disabled', true);
    var uname = $('#uname').val();
    var lpwd = $('#lpwd').val();
    if (!uname) {
        $('#uname').focus();
        $('#uname').attr('placeholder', "请填写登录帐号");
        $(this).prop('disabled', false);
        $('.loadingbar3').hide();
        layer.msg('请填写登录帐号', { icon: 7 }); 
        return
    }
    if (!lpwd) {
        $('#lpwd').focus();
        $('#lpwd').attr('placeholder', "请填写登录密码");
        $(this).prop('disabled', false);
        $('.loadingbar3').hide();
        layer.msg('请填写登录密码', { icon: 7 }); 
        return
    }
    $.ajax({
        type: "POST",
        async: true,  // 设置同步方式
        cache: false,
        url: "/admin/login",
        data: { "aname": uname, "lpwd": lpwd, "mid": mid},
        dataType: "json",
        beforeSend: function () {
        },
        success: function (result) {
            if (eval(result).state == 1) {
                $.cookie('admin_token', eval(result).newtoken, { expires: 1, path: '/' });
                location.href = '/_admin/main?mid=' + mid;

            } else if (eval(result).state == 2) {
                $('.loadingbar3').hide();
                layer.msg(eval(result).message, { icon: 2 });
            }
            else {
                $('.loadingbar3').hide();
                layer.msg(eval(result).message, { icon: 2 });
            }
        }
    });
    $(this).prop('disabled', false);
}


    var needValidateCode = false,
        isUsedNew = true;
$(function () {
    if (!navigator.cookieEnabled) {
        alert("请确认浏览器的cookie是否被禁用");
    }
    showQrCode();
    // 添加回车事件
    $('.bottom .center .item input').keydown(function (e) {
        if (e.keyCode == 13) checkCtrlEnter();
    });

    //// 是否两周内自动登录
    //$('.icon-nocheck, .login-tip').click(function () {
    //    $('.icon-nocheck').toggleClass('icon-check');
    //});

    // 明文密文转换
    $('.icon-4').click(function () {
        $(this).toggleClass('icon-5');
        var pwdObj = $('#lpwd');
        var pwdTextObj = $('#loginPwdText');
        var pwd = $(this).hasClass('icon-5') ? pwdObj.val() : pwdTextObj.val();
        pwdObj.toggleClass('hide').val(pwd);
        pwdTextObj.toggleClass('hide').val(pwd);
    });

    $("#loginPwdText").change(function () {
        $('#lpwd').val($("#loginPwdText").val());
    });

    //// 更新验证码
    //$('#validateImg, #validateRefresh').click(function () {
    //    $('#validateImg').attr('src', '/validateCode.jsp?' + Math.random());
    //});

    // 判断窗口是否有更改
    resizeWindow();
    $(window).resize(resizeWindow);


});

function init() {
    var loginCacct = $('#loginCacct');
    var loginSacct = $('#loginSacct');
    var loginCacctValue = '';
    if (Fai.Cookie.get("beiAn")) {
        loginCacct.val(loginCacctValue);
        $('#beian').hide();
        $('#beianInfoHref').hide();
        $('#beianCopyright').hide();
    }
    var loginSacctValue = Fai.Cookie.get('loginSacct');
    if (loginSacctValue) {
        loginSacct.val(loginSacctValue);
    }

    if ($("#loginCacct").val() === "") {
        $("#loginCacct").focus();
    } else if ($("#loginSacct").val() === "") {
        $("#loginSacct").focus();
    } else {
        $("#loginPwd").focus();
    }
}

// 窗口改变调整大小
function resizeWindow() {
    if ($('.new-login').height() <= 518) {
        $('.qr-code').css('height', 518);
    } else {
        $('.qr-code').css('height', '100%');
    }
    if ($(window).height() < 684) {
        $(body).css({
            position: 'relative',
        });
    } else {
        $(body).css({
            position: 'static',
        });
    }
}

    function checkCtrlEnter() {
        if ($("#loginCacct").val() === '') {
        $("#loginCacct").focus();
    } else if ($("#loginSacct").val() === '') {
        $("#loginSacct").focus();
    } else if ($("#loginPwd").val() === '') {
        $("#loginPwd").focus();
    } else {
        sub();
    }
}


function showQrCode() {
    if (false) {
        $('.new-login .top').addClass('no-border-radius-2');
        $('.new-login .bottom').addClass('no-border-radius-4');
        $('.show-qr-code').css({
            'background': 'url("demo.png") no-repeat',
            'backgroundSize': '166px 166px'
        });
    } else {
        $('.main-body').addClass('no-qrcode');
        $('.qr-code').toggleClass('hide');

    }
}

function error(msg) {
    $('.new-login .error').html(msg || '').css('opacity', 0).show().stop().animate({
        opacity: 1
    }, 200);
}