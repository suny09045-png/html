
var TEST_ACCOUNT = "admin";
var TEST_PASSWORD = "123456";

function setout() {
    if (GetQueryString("out") == 1) {
        $.cookie('admin_token', '', { expires: 1, path: '/' });
    }
}
setout();

var mid = GetQueryString("mid");
if (mid == null) {
    mid = "1";
}

function sub() {
    var uname = $('#uname').val();
    var lpwd = $('#lpwd').val();

    if (!uname) {
        $('#uname').attr('placeholder', "请填写登录帐号");
        if (typeof layer !== 'undefined') {
            layer.msg('请填写登录帐号', { icon: 7 });
        } else {
            alert('请填写登录帐号');
        }
        return;
    }

    if (!lpwd) {
        $('#lpwd').attr('placeholder', "请填写登录密码");
        if (typeof layer !== 'undefined') {
            layer.msg('请填写登录密码', { icon: 7 });
        } else {
            alert('请填写登录密码');
        }
        return;
    }

    if (uname === TEST_ACCOUNT && lpwd === TEST_PASSWORD) {
        var mockToken = 'test_token_' + Date.now();
        $.cookie('admin_token', mockToken, { expires: 1, path: '/' });
        
        if (typeof layer !== 'undefined') {
            layer.msg('登录成功！', { icon: 1 });
        }
        
        setTimeout(function() {
            location.href = '/template/num001/main.html?mid=' + mid;
        }, 1000);
    } else {
        if (typeof layer !== 'undefined') {
            layer.msg('账号或密码错误', { icon: 2 });
        } else {
            alert('账号或密码错误');
        }
    }
}

$(function () {
    if (!navigator.cookieEnabled) {
        alert("请确认浏览器的cookie是否被禁用");
    }
    
    $('#uname').val(TEST_ACCOUNT);
    $('#lpwd').val(TEST_PASSWORD);
    
    $('#uname').keydown(function (e) {
        if (e.keyCode == 13) sub();
    });
    $('#lpwd').keydown(function (e) {
        if (e.keyCode == 13) sub();
    });
});

function resizeWindow() {
    if ($('.new-login').height() <= 518) {
        $('.qr-code').css('height', 518);
    } else {
        $('.qr-code').css('height', '100%');
    }
}

function togglePwd() {
    var pwd = document.getElementById('lpwd');
    var text = document.getElementById('loginPwdText');
    if (pwd.classList.contains('hide')) {
        pwd.classList.remove('hide');
        text.classList.add('hide');
    } else {
        pwd.classList.add('hide');
        text.classList.remove('hide');
        text.value = pwd.value;
    }
}
