$(function () {
    $(".yes_login").click(function () {
        ajax("../app/login/", "post", {
            username: $("#username").val(),
            password: $("#password").val()
        }, c);
    });
    $("#password").keyup(function (event) {
        if (event.keyCode == 13) {
            ajax("../app/login/", "post", {
                username: $("#username").val(),
                password: $("#password").val()
            }, c);
        }
    });
});


/**
 * 登录回调函数
 * the callback of login
 * */
var c = function (msg) {
    console.log(msg);
    if (msg.status) {
        //如果存在user属性，说明是普通用户
        if (msg.user) {
            window.location.href = "../../employee/user_page/"
        } else {
            window.location.href = "../../employee/admin_page/"
        }
    } else {
        alert(msg.msg);
    }
}