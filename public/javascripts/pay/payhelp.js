/*
 Created on 4/16/2018  
 Author: zhangliang
 Description:     
*/
var AlipayHelpMVC = {
    /*常量*/
    Common: {
        tableId: '',
        URLs: {
            "getpayHTML": "/api/zl_alipay/_pay"
        }
    },
    /*初始化*/
    Init: function () {
        //拷贝父页面表单
        var tmp = parent.$("#frm-pay").clone();
        //添加到本页面
        $("#dv-payhelp-hidden").prepend(tmp);
        //直接提交表单,执行请求
        AlipayHelpMVC.Action.payExcute();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {

        },
        /*视图渲染*/
    },
    /*动作相关内容*/
    Action: {
        payExcute: function () {
            var data_ = $("#frm-pay").serializeJSON({checkboxUncheckedValue:"0"});
            var result_;
            $.ajax({
                type: "POST",
                url: AlipayHelpMVC.Common.URLs.getpayHTML,
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                dataType: "json",
                success: function (data) {
                    result_ = data.msg_;
                    //将返回结果添加为body的第一个表单
                    $("body").prepend(data.msg_);
                }
            });
            return result_;
        }
    },
}

//函数入口
$(function () {
    AlipayHelpMVC.Init();
})