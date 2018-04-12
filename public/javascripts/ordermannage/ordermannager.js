/*
 Created on 4/9/2018  
 Author: zhangliang
 Description:     
*/
var OrderManagerMVC = {
    /*常量*/
    Common: {
        DATATABLE: '',
        DATATABLE_IDs: [],
        URLs: {
            "getdts": "/api/user/_page",
            "addOrderUrl": "/api/user/_save",
            "baseOrderUrl": "/api/user/"
        }
    },
    /*初始化*/
    Init: function () {
        OrderManagerMVC.View.bindEvent();
        OrderManagerMVC.View.initOrderDataTable();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {
            $("#but-OrderAdd").on('click',function () {
                $('#form_user_add_edit')[0].reset();
                $("input[name='userName']").attr('readOnly',false);
                OrderManagerMVC.View.openLayer("新增用户", 'add', $('#div_add_user'));
            });
            $("#but-OrderEdit").on('click',function () {
                if(OrderManagerMVC.Common.DATATABLE_IDs.length != 1){
                    layer.msg('请选择且只选择一条数据！', {time: 2000});
                    return false;
                }else{
                    $.ajax({
                        type: 'GET',
                        url: OrderManagerMVC.Common.URLs.baseOrderUrl+'/'+OrderManagerMVC.Common.DATATABLE_IDs[0],
                        contentType: 'application/json;charset=UTF-8',
                        async:false,
                        success: function (data) {
                            if(data.code_ == 0){
                                OrderManagerMVC.View.openLayer("编辑用户", 'edit', $('#div_add_user'));
                                $('#form_user_add_edit').setForm(data.data);
                                $("input[name='userName']").attr('readOnly',true);
                            }else{
                                layer.msg('获取该数据失败！'+data.msg_,{time:2000});
                            }
                        },
                        error: function (data) {
                            layer.msg('获取该数据失败！'+data.msg_,{time:2000});
                        }
                    });
                }
            });
            $("#but-OrderDel").on('click',function () {
                if(OrderManagerMVC.Common.DATATABLE_IDs.length < 1){
                    layer.msg('请至少选择一条数据！', {time: 2000});
                    return false;
                }else{
                    layer.confirm('确认删除所选数据吗？', {icon: 3, title:'提示'}, function(index){
                        OrderManagerMVC.Action.delete(index);
                    });
                }
            });
            $("#user-dts").on('click', 'input:checkbox.selectBox', function () {
                OrderManagerMVC.Common.DATATABLE_IDs = [];
                var checkboxes = $('#user-dts input:checkbox:checked');
                $.each(checkboxes, function () {
                    OrderManagerMVC.Common.DATATABLE_IDs.push($(this).attr("data-id"));
                })
                console.log("选中的行有:" + OrderManagerMVC.Common.DATATABLE_IDs + "\t选中的行数：" + OrderManagerMVC.Common.DATATABLE_IDs.length);
            })
        },
        /*视图渲染*/
        initOrderDataTable: function () {
            OrderManagerMVC.Common.tableId = '';
            OrderManagerMVC.Common.DATATABLE = $("#user-dts").DataTable({
                "ajax": {
                    "url": OrderManagerMVC.Common.URLs.getdts, // ajax source
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
                        "data": "userId",
                        'title': '#',
                        "width": "20px",
                        'class': 'text-center',
                        "render": function (data) {
                            return "<input type='checkbox' name='arrSel' class='selectBox' data-id='" + data + "'>"
                        }
                    }, {
                        "data": "userName", 'title': '名称', 'class': 'text-center'
                    }, {
                        "data": "userPassword", 'title': '密码', 'class': 'text-center'
                    }, {
                        "data": "userFullName", 'title': '全名', 'class': 'text-center'
                    }, {
                        "data": "userAge", 'title': '年龄', 'class': 'text-center'
                    }, {
                        "data": "userGender", 'title': '性别', 'class': 'text-center', render: function (data) {
                            return data ? '女' : '男';
                        }
                    }, {
                        "data": "userEmail", 'title': '邮箱', 'class': 'text-center'
                    }, {
                        "data": "userAddress", 'title': '地址', 'class': 'text-center'
                    }]
            });
        },

        openLayer: function (title,action,$content) {
            layer.open({
                type: 1,
                area: ['700px','500px'],
                shade: 0.1,
                shadeClose: true,
                title: title,
                btn: ['确定','取消'],
                moveOut: true,
                content: $content,
                yes: function (index, layero) {
                    if(action == "add"){
                        OrderManagerMVC.Action.add(index);
                    }else if(action == "edit"){
                        OrderManagerMVC.Action.edit(index);
                    }else{}
                },
                btn2: function (index, layero) {
                    //alert("no");
                }
            });
        }
    },
    /*动作相关内容*/
    Action: {
        add: function (layerIndex) {
            var data_ = $("#form_user_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "POST",
                url: OrderManagerMVC.Common.URLs.addOrderUrl,
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('添加成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            OrderManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
                            OrderManagerMVC.Common.DATATABLE_IDs = [];
                        });
                    }else{
                        layer.msg('添加失败！' + data.msg_, {time: 3000});
                    }
                },
                error: function (data) {
                    layer.msg('添加失败！' + data.msg_, {time: 3000});
                }
            });
        },
        edit: function (layerIndex) {
            var data_ = $("#form_user_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "PUT",
                url: OrderManagerMVC.Common.URLs.baseOrderUrl+'/'+OrderManagerMVC.Common.DATATABLE_IDs[0],
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('修改成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            OrderManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
                        });
                    }else{
                        layer.msg('修改失败！' + data.msg_, {time: 3000});
                    }
                },
                error: function (data) {
                    layer.msg('修改失败！' + data.msg_, {time: 3000});
                }
            });
        },
        delete: function (layerIndex) {
            layer.msg('模拟删除', {time:2000});
            layer.close(layerIndex);
            $.ajax({
                type: "DELETE",
                url: OrderManagerMVC.Common.URLs.baseOrderUrl+'/'+OrderManagerMVC.Common.DATATABLE_IDs[0],
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('删除成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            OrderManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
                        });
                    }else{
                        layer.msg('删除失败！' + data.msg_, {time: 3000});
                    }

                },
                error: function (data) {
                    layer.msg('删除失败！' + data.msg_, {time: 3000});
                }
            });
        }
    },
}

//函数入口
$(function () {
    OrderManagerMVC.Init();
})