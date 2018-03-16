/*
 Created on 3/15/2018  
 Author: zhangliang
 Description: template.js    
*/
var templateMVC = {
    /*常量*/
    Common: {
        tableId: '',
        URLs: {
            "getdts": "/demo/getdts"
        }
    },
    /*初始化*/
    Init: function () {
        templateMVC.View.bindEvent();
        templateMVC.View.initUserDataTable();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {

        },
        /*视图渲染*/
        initUserDataTable: function () {
            templateMVC.Common.tableId = '';
            $("#template-dts").DataTable({
                "ajax": {
                    "url": templateMVC.Common.URLs.getdts, // ajax source
                    contentType: 'application/json;charset=UTF-8',
                    type: "POST",
                    data: function (d) { //自己添加参数
                        return JSON.stringify({
                            start: d.start,
                            length: d.length
                        });
                    }
                },
                "columns": [
                    {
                        "data": "id", 'title': '#', "width": "20px", 'class': 'text-center', "render": function (data) {
                            return "<input type='checkbox' name='arrSel' class='selectBox' data-id='" + data + "'>"
                        }
                    }, {
                        "data": "name", 'title': '名称', 'class': 'text-center'
                    }, {
                        "data": "role", 'title': '角色', 'class': 'text-center'
                    }, {
                        "data": "desc", 'title': '描述', 'class': 'text-center'
                    }]
            });
        }
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
    templateMVC.Init();
})