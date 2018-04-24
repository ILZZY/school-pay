/*
 Created on 4/13/2018  
 Author: zhangliang
 Description:     
*/
var SSBindMVC = {
    /*常量*/
    Common: {
        URLs:{
            callback_url:'http://localhost:8000/callbackurl',
            success_url:'http://localhost:3001/login/xueji',
            failed_url:'http://localhost:3001/login/xueji_fail',
            ssAuth_url:''
        },
        XJToken:''
    },
    /*初始化*/
    Init: function () {
        SSBindMVC.View.bindEvent();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {
            //获取授权H5
            $("#btn-ssAuth-h5").on('click',function () {
                layer.msg('正在获取H5数据',{time:2000},function () {
                    var data_ = SSBindMVC.Action.getSSH5();
                    //debugger
                    if(data_){
                        console.log(data_);
                        if (data_.code == 10000) {
                            layer.msg('数据接口请求成功！', {time: 2000}, function () {
                                $("#npt-ssAuth-h5").val(data_.result.url);
                                SSBindMVC.Common.URLs.ssAuth_url = data_.result.url;
                            });
                        } else {
                            layer.msg('数据接口请求失败！' + data_.msg+' code='+data_.code, {time: 3000});
                        }
                    }else{
                        layer.msg("获取的数据为空！",{time:2000});
                    }
                })
            })

            //获取授权token
            $("#btn-ssAuth").on('click', function () {
                var data_;
                var ssAuth = false;
                var ssAuthMsg = "你还未进行过授权！即将跳转到第三方授权界面，请您进行授权。";
                var timeout = true;
                var indexSSMsgALayer=layer.msg("正在验证是否已经进行过授权...",{time:0});
                var indexSSALayer = layer.open({
                    type: 3,
                    time: 7000,
                    success: function(layero, index){
                        setTimeout(function () {
                            data_ = SSBindMVC.Action.getSSTokenFromSession();
                            if (data_.token) {
                                ssAuth = true;
                                ssAuthMsg = "你已进行过授权！可直接获取学籍信息。";
                                $("#npt-ssAuth-token").val(data_.token);
                                SSBindMVC.Common.XJToken = data_.token;
                            }
                            timeout = false;
                            layer.close(index);
                        },'2000');
                    },
                    end: function () {
                        layer.close(indexSSMsgALayer);
                        if(timeout){
                            layer.msg("验证请求超时",{time:2000});
                        }else{
                            layer.msg(ssAuthMsg,{time:3000},function () {
                                if(!ssAuth){
                                    var url_ = SSBindMVC.Common.URLs.ssAuth_url;
                                    if(!url_){
                                        layer.msg("未取到网址,请先获取授权网址！",{time:3000});
                                        $("#div-ssAuth-h5").show();
                                        return false;
                                    }
                                    var index = layer.open({
                                        type: 2,
                                        content: [SSBindMVC.Common.URLs.ssAuth_url, 'no'],
                                        area: ['400px', '500px'],
                                        maxmin: true,
                                        closeBtn: 1,
                                        cancel: function () {
                                            var data_ = SSBindMVC.Action.getSSTokenFromSession();
                                            $("#npt-ssAuth-token").val(data_.token);
                                            SSBindMVC.Common.XJToken = data_.token;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            })

            //通过token获取学籍信息
            $("#btn-getss").on('click', function () {

                var token_ = SSBindMVC.Common.XJToken;

                if(!token_){
                    layer.msg("还未获取到授权token,请先执行该获取操作！",{time:3000});
                    return false;
                }
                layer.msg("正在获取学籍信息...",{time:2000},function () {
                    var data_ = SSBindMVC.Action.getSSFromXuexin(token_);
                    console.log(data_);
                    if (data_.code == 10000) {
                        layer.msg('数据接口请求成功！'+' code='+data_.code, {time: 2000}, function () {
                            if(data_.result){
                                (data_.result.schoolRoll[0]).admissionPhoto = '已经在ssbind.js去除';
                                (data_.result.schoolRoll[0]).graduationPhoto = '已经在ssbind.js去除';
                                (data_.result.schoolRoll[0]).rawImg = '已经在ssbind.js去除';
                            }
                            $("#id-xueji-info").html(JSON.stringify(data_));//赋值
                        });
                    } else {
                        layer.msg('数据接口请求失败！' + data_.msg+' code='+data_.code, {time: 2000},function () {
                            $("#id-xueji-info").html(JSON.stringify(data_));//赋值
                        });
                    }
                })

            })
        },
        /*视图渲染*/
    },
    /*动作相关内容*/
    Action: {
        /*获取存在session中的学信网token*/
        getSSTokenFromSession: function () {
            var data_;
            $.ajax({
                type: "GET",
                url: '/login/xueji',
                async: false,
                success: function (data) {
                    console.log("从 /login/xueji 获取的数据：" + JSON.stringify(data));
                    data_ = data;
                }
            });
            return data_;
        },

        /*通过token获取学籍信息*/
        getSSFromXuexin: function (token) {
            var data_;
            $.ajax({
                type: "GET",
                url: '/api_xueji/edu_query?query_code=' + token + '&appkey=f4372533aae2935f885155cf80ceb316',
                async: false,
                success: function (data) {
                    data_ = data;
                },
                error: function (data) {
                    layer.msg('ajax失败！' + data.msg, {time: 3000});
                    data_ = data;
                }
            });
            return data_;
        },

        /*获取授权H5*/
        getSSH5: function (token) {
            var data_;
            $.ajax({
                type: "GET",
                url: '/api_xueji/edu_h5_page?callback_url='+SSBindMVC.Common.URLs.callback_url+'&success_url='+SSBindMVC.Common.URLs.success_url+'&failed_url='+SSBindMVC.Common.URLs.failed_url+'&appkey=f4372533aae2935f885155cf80ceb316',
                async: false,
                success: function (data) {
                    data_ = data;
                },
                error: function (data) {
                    layer.msg('ajax失败！' + data.msg, {time: 3000});
                    data_ = data;
                }
            });
            return data_;
        }
    },
}

//函数入口
$(function () {
    SSBindMVC.Init();
})