var LoginMVC = {
    Common: {},
    Init: function () {
        LoginMVC.View.bindEvent();
    },
    View: {
        bindEvent: function () {
            $("#forget-password").on("click", function () {
                $(".login-form").hide();
                $(".forget-form").show();
            });
            $("#btn-back").on("click", function () {
                $(".forget-form").hide();
                $(".login-form").show();
            });
            $("#btn-register").on("click", function () {
                $(".login-form").hide();
                $(".register-form").show();
            });
            $("#btn-register-back").on("click", function () {
                $(".register-form").hide();
                $(".login-form").show();
            });
            $("#btn-login").on("click",function () {
                LoginMVC.Action.login();
            })
        }
    },
    Action: {
        login: function () {
            $.ajax({
                type: "POST",
                url: "/login",
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    location.reload(true);
                }
            });
        }
    },
}

//函数入口
$(function () {
    LoginMVC.Init();
})