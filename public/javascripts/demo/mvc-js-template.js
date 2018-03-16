/*
 Created on 3/15/2018  
 Author: zhangliang
 Description: mvc-js-template.js
*/
var xxxMVC = {
    /*常量*/
    Common: {},
    /*初始化*/
    Init: function () {
        xxxMVC.View.bindEvent();
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
        add: function () {
            $.ajax({
                type: "",
                url: "",
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    console.log(data);
                }
            });
        }
    },
}

//函数入口
$(function () {
    xxxMVC.Init();
})