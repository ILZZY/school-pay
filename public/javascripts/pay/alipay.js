/*
 Created on 4/16/2018  
 Author: zhangliang
 Description:     
*/
var AlipayMVC = {
    /*常量*/
    Common: {
        tableId: '',
        URLs: {
            "getpayHTML": "/api/zl_alipay/_pay"
        },
        NodeParam:NodeParam?JSON.parse(NodeParam):''
    },
    /*初始化*/
    Init: function () {
        AlipayMVC.View.bindEvent();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {
            $("#btn-pay").on('click',function () {
                var orderId_ = AlipayMVC.Action.setOrderSequence();
                var username_ = AlipayMVC.Action.setOrderUserName();
                console.log("订单号："+orderId_+"\t"+"下单用户："+username_);
                /*测试支付回掉页面路由
                $.ajax({
                    url: "/pay/return_url",
                    type: "GET",
                    contentType: "application/json;charset=UTF-8",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        debugger
                    }
                })*/
                layer.msg("正在打开支付界面...",{time:2000},function () {
                    var index = layer.open({
                        type:2,
                        title:"支付辅助页面",
                        content:"pay/payhelp",
                        maxmin:true,
                        success: function () {
                            console.log("支付界面打开成功！")
                        }
                    });
                    layer.full(index);
                });
            });
        },
        /*视图渲染*/
    },
    /*动作相关内容*/
    Action: {
        setOrderSequence: function(){
            var vNow = new Date();
            var sNow = "";
            sNow += String(vNow.getFullYear());
            sNow += String(vNow.getMonth() + 1);
            sNow += String(vNow.getDate());
            sNow += String(vNow.getHours());
            sNow += String(vNow.getMinutes());
            sNow += String(vNow.getSeconds());
            sNow += String(vNow.getMilliseconds());
            $("input[name='out_trade_no']").val(sNow);
            return sNow;
        },

        setOrderUserName: function(){
            var username_ = $('.username', window.parent.document).text();
            username_ = username_.trim();
            $("input[name='orderUserName']").val(username_);
            return username_;
        }
    },
}

//函数入口
$(function () {
    AlipayMVC.Init();
})