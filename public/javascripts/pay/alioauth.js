/*
 Created on 4/23/2018  
 Author: zhangliang
 Description:     
*/
var AliOauthMVC = {
    /*常量*/
    Common: {
        tableId: '',
        URLs: {
            "getoauthHTML": "/api/zl_alipay/_oauthurl"
        },
        NodeParam:NodeParam?JSON.parse(NodeParam):'',
        AUTH_CODE: '',
        ALI_OAUTH_H5_URL: ''
    },
    /*初始化*/
    Init: function () {
        AliOauthMVC.View.bindEvent();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {
            $("#btn-aliAuth-h5").on("click",function () {
                var data_ = AliOauthMVC.Action.getoauthUrl();
                if(data_){
                    AliOauthMVC.Common.ALI_OAUTH_H5_URL = data_.msg_;
                    $("#npt-aliAuth-h5").val(AliOauthMVC.Common.ALI_OAUTH_H5_URL);
                }else{
                    layer.msg("后台获取数据为空！",{time:2000});
                }
            });

            $("#btn-aliAuthCode").on("click",function () {
                var url_ = AliOauthMVC.Common.ALI_OAUTH_H5_URL;
                if(url_){
                    var index = layer.open({
                        type: 2,
                        content: [url_, 'no'],
                        area: ['400px', '500px'],
                        maxmin: true,
                        closeBtn: 1,
                        cancel: function () {
                            var data_ = AliOauthMVC.Action.getAliAuthCodeFromSession();
                            if(data_){
                                var tmp_ = JSON.parse(data_);
                                AliOauthMVC.Common.AUTH_CODE = tmp_.auth_code;
                                $("#npt-aliAuth-code").val(AliOauthMVC.Common.AUTH_CODE);
                            }
                        }
                    });
                }else{
                    layer.msg('还未获取到授权页面URL',{time:2000});
                }
            });

            $("#btn-aliAuthToken").on("click",function () {
                var authcode_ = AliOauthMVC.Common.AUTH_CODE;
                if(authcode_) {
                    var data_= AliOauthMVC.Action.getoauthtoken(authcode_);
                    var token_ = data_.msg_;
                    if(token_) {
                        AliOauthMVC.Common.AUTHO_TOKEN = token_;
                        $("#npt-aliAuth-token").val(token_);
                    }else{
                        layer.msg('token已过期，请重新获取',{time:2000});
                    }
                }else {
                    layer.msg("还未获取到authCode",{time:2000});
                }
            });

            $("#btn-getaliInfo").on('click',function () {
                var authtoken_ = AliOauthMVC.Common.AUTHO_TOKEN;
                if(authtoken_){
                    var data_ = AliOauthMVC.Action.getAliInfo(authtoken_);
                    debugger
                    $("#id-ali-info").html(data_.msg_);
                }else{
                    layer.msg('还未获取到授权token！',{time:2000});
                }
            })
        },
        /*视图渲染*/
    },
    /*动作相关内容*/
    Action: {
        getoauthUrl: function () {
            var data_;
            $.ajax({
                type: "POST",
                url: AliOauthMVC.Common.URLs.getoauthHTML,
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    data_ = data;
                }
            })
            return data_;
        },

        /*获取存在session中的支付宝authCode*/
        getAliAuthCodeFromSession: function () {
            var data_;
            $.ajax({
                type: "GET",
                url: '/pay/alioauthcode',
                async: false,
                success: function (data) {
                    data_ = data;
                }
            });
            return data_;
        },

        /*获取后台中的支付宝token*/
        getoauthtoken: function (authCode) {
            var data_;
            $.ajax({
                type: "POST",
                url: '/api/zl_alipay/_oauthtoken'+'/'+authCode,
                async: false,
                success: function (data) {
                    data_ = data;
                }
            });
            return data_;
        },

        /*获取后台中的支付宝用户信息*/
        getAliInfo: function (authToken) {
            var data_;
            $.ajax({
                type: "POST",
                url: '/api/zl_alipay/_oauthinfo'+'/'+authToken,
                async: false,
                success: function (data) {
                    data_ = data;
                }
            });
            return data_;
        }
    },
}

//函数入口
$(function () {
    AliOauthMVC.Init();
})
