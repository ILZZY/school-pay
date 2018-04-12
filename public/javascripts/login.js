var LoginMVC = {
    Common: {
        URLs:{
            registerUrl: '/api/user/_save'
        }
    },
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
                $(".register-form")[0].reset();
                $(".login-form").show();
            });
            $("#btn-login").on("click",function () {
                LoginMVC.Action.login();
            });
            $("#btn-register-submit").on('click',function () {
                LoginMVC.Action.register();
            })
        }
    },
    Action: {
        login: function () {
            var data_ = $("#login-form").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "POST",
                url: "/login",
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    location.reload(true);
                },
                error: function (data) {
                    var data_ = data.responseJSON;
                    $("#login-error label").html("");
                    $("#login-error label").html(data_.msg_);
                    $("#login-error").show();
                }
            });
        },

        register: function () {
            var data_ = $("#register-form").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "POST",
                url: '/login/register',
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    if(data.code_==0){
                        layer.msg('注册成功！', {time: 3000}, function () {
                            location.reload(true);
                        });
                    }else{
                        layer.msg('注册失败！'+data.msg_, {time: 3000});
                    }
                },
                error: function (data) {
                    debugger
                }
            });
        }
    }
}

//函数入口
$(function () {
    LoginMVC.Init();
})