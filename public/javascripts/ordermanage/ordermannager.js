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
        USER_NAME: '',
        URLs: {
            "getdts": "/api/order/_pageWithUserName",
            "addOrderUrl": "/api/order/_save",
            "baseOrderUrl": "/api/order/"
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
            /*$("#but-OrderAdd").on('click',function () {
                $('#form_order_add_edit')[0].reset();
                $("input[name='orderName']").attr('readOnly',false);
                OrderManagerMVC.View.openLayer("新增用户", 'add', $('#div_add_order'));
            });*/
            $("#but-OrderAdd").on('click',function () {
                $('#form_order_add_edit')[0].reset();
                $("input[name='userName']").attr('readOnly',false);
                OrderManagerMVC.View.openLayer("新增订单", 'add', $('#div_add_order'));
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
                                OrderManagerMVC.View.openLayer("编辑订单", 'edit', $('#div_add_order'));
                                $('#form_order_add_edit').setForm(data.data);
                                $("input[name='orderName']").attr('readOnly',true);
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
            $("#order-dts").on('click', 'input:checkbox.selectBox', function () {
                OrderManagerMVC.Common.DATATABLE_IDs = [];
                var checkboxes = $('#order-dts input:checkbox:checked');
                $.each(checkboxes, function () {
                    OrderManagerMVC.Common.DATATABLE_IDs.push($(this).attr("data-id"));
                })
                console.log("选中的行有:" + OrderManagerMVC.Common.DATATABLE_IDs + "\t选中的行数：" + OrderManagerMVC.Common.DATATABLE_IDs.length);
            })
        },
        /*视图渲染*/
        initOrderDataTable: function () {
            OrderManagerMVC.Common.tableId = '';
            if(!OrderManagerMVC.Common.USER_NAME){
                var username_ = $('.username', window.parent.document).text();
                username_ = username_.trim();
                OrderManagerMVC.Common.USER_NAME = username_;
            }
            OrderManagerMVC.Common.DATATABLE = $("#order-dts").DataTable({
                "ajax": {
                    "url": OrderManagerMVC.Common.URLs.getdts+'/'+OrderManagerMVC.Common.USER_NAME, // ajax source
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
                        "data": "orderId",
                        'title': '#',
                        "width": "20px",
                        'class': 'text-center',
                        "render": function (data) {
                            return "<input type='checkbox' name='arrSel' class='selectBox' data-id='" + data + "'>"
                        }
                    }, {
                        "data": "orderOutTradeNo", 'title': '商户订单号', 'class': 'text-center'
                    }, {
                        "data": "oderSubject", 'title': '订单主题', 'class': 'text-center'
                    }, {
                        "data": "orderAmount", 'title': '订单金额', 'class': 'text-center'
                    }, {
                        "data": "orderUserName", 'title': '下单用户', 'class': 'text-center'
                    }, {
                        "data": "orderGenerateTime", 'title': '订单生成时间', 'class': 'text-center',render: function (data) {
                            return new Date(data).toUTCString();
                        }
                    }, {
                        "data": "orderStatus", 'title': '订单状态', 'class': 'text-center', render: function (data) {
                            var result = "UNKNOWN";
                            if(0 === data){
                                result = '未支付';
                            }
                            else if(1 === data){
                                result = '已支付';
                            }
                            return result;
                        }
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
            var data_ = $("#form_order_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
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
            var data_ = $("#form_order_add_edit").serializeJSON({checkboxUncheckedValue: "0"});
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