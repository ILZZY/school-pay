/*
 Created on 4/9/2018  
 Author: zhangliang
 Description:     
*/
var RoleManagerMVC = {
    /*常量*/
    Common: {
        DATATABLE: '',
        DATATABLE_IDs: [],
        URLs: {
            "getdts": "/api/role/_page",
            "addRoleUrl": "/api/role/_save",
            "baseRoleUrl": "/api/role/"
        }
    },
    /*初始化*/
    Init: function () {
        RoleManagerMVC.View.bindEvent();
        RoleManagerMVC.View.initRoleDataTable();
    },
    /*视图相关类容*/
    View: {
        /*事件绑定*/
        bindEvent: function () {
            $("#but-RoleAdd").on('click',function () {
                $('#form_role_add_edit')[0].reset();
                $("input[name='roleName']").attr('readOnly',false);
                RoleManagerMVC.View.openLayer("新增角色", 'add', $('#div_add_role'));
            });
            $("#but-RoleEdit").on('click',function () {
                if(RoleManagerMVC.Common.DATATABLE_IDs.length != 1){
                    layer.msg('请选择且只选择一条数据！', {time: 2000});
                    return false;
                }else{
                    $.ajax({
                        type: 'GET',
                        url: RoleManagerMVC.Common.URLs.baseRoleUrl+'/'+RoleManagerMVC.Common.DATATABLE_IDs[0],
                        contentType: 'application/json;charset=UTF-8',
                        async:false,
                        success: function (data) {
                            if(data.code_ == 0){
                                RoleManagerMVC.View.openLayer("编辑角色", 'edit', $('#div_add_role'));
                                $('#form_role_add_edit').setForm(data.data);
                                $("input[name='roleName']").attr('readOnly',true);
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
            $("#but-RoleDel").on('click',function () {
                if(RoleManagerMVC.Common.DATATABLE_IDs.length < 1){
                    layer.msg('请至少选择一条数据！', {time: 2000});
                    return false;
                }else{
                    layer.confirm('确认删除所选数据吗？', {icon: 3, title:'提示'}, function(index){
                        RoleManagerMVC.Action.delete(index);
                    });
                }
            });
            $("#role-dts").on('click', 'input:checkbox.selectBox', function () {
                RoleManagerMVC.Common.DATATABLE_IDs = [];
                var checkboxes = $('#role-dts input:checkbox:checked');
                $.each(checkboxes, function () {
                    RoleManagerMVC.Common.DATATABLE_IDs.push($(this).attr("data-id"));
                })
                console.log("选中的行有:" + RoleManagerMVC.Common.DATATABLE_IDs + "\t选中的行数：" + RoleManagerMVC.Common.DATATABLE_IDs.length);
            })
        },
        /*视图渲染*/
        initRoleDataTable: function () {
            RoleManagerMVC.Common.tableId = '';
            RoleManagerMVC.Common.DATATABLE = $("#role-dts").DataTable({
                "ajax": {
                    "url": RoleManagerMVC.Common.URLs.getdts, // ajax source
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
                        "data": "roleId",
                        'title': '#',
                        "width": "20px",
                        'class': 'text-center',
                        "render": function (data) {
                            return "<input type='checkbox' name='arrSel' class='selectBox' data-id='" + data + "'>"
                        }
                    }, {
                        "data": "roleName", 'title': '名称', 'class': 'text-center'
                    }, {
                        "data": "roleDesc", 'title': '描述', 'class': 'text-center'
                    }, {
                        "data": "roleId", 'title': '角色ID', 'class': 'text-center'
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
                        RoleManagerMVC.Action.add(index);
                    }else if(action == "edit"){
                        RoleManagerMVC.Action.edit(index);
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
            var data_ = $("#form_role_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "POST",
                url: RoleManagerMVC.Common.URLs.addRoleUrl,
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('添加成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            RoleManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
                            RoleManagerMVC.Common.DATATABLE_IDs = [];
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
            var data_ = $("#form_role_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
            $.ajax({
                type: "PUT",
                url: RoleManagerMVC.Common.URLs.baseRoleUrl+'/'+RoleManagerMVC.Common.DATATABLE_IDs[0],
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify(data_),
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('修改成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            RoleManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
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
                url: RoleManagerMVC.Common.URLs.baseRoleUrl+'/'+RoleManagerMVC.Common.DATATABLE_IDs[0],
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    if(data.code_ == 0){
                        layer.msg('删除成功！', {time: 2000}, function () {
                            layer.close(layerIndex);
                            RoleManagerMVC.Common.DATATABLE.ajax.reload(null, false); // 刷新表格数据，分页信息不会重置
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
    RoleManagerMVC.Init();
})