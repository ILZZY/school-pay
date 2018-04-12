/**
 * Author:zhangliang
 * Description: 通用AJAX调用封装
 * 普通使用方式：
 * $.axPost(url.data)
 * .done(function(data, status,jqxhr){
 *  //成功回调等效success
 * })
 * .fail(function(jqxhr, status, error){
 *  //错误回调，等效error
 * })
 * .always(functon(){
 *  //ajax请求完成时回调，等效complete
 * })
 * .done(function(data, status,jqxhr){
 *  //第二个回调函数
 * })
 * 或者：
 * $.axPost(url.data).then(
 *  function(data, status,jqxhr){
 *      //成功回调等效success
 *  },
 * function(jqxhr, status, error){
 *  //错误回调，等效error
 * })
 *
 * 多个ajax请求并发调用:任意一个失败都会执行
 * $.when($.axGet(url.data),$.axPost(url.data))
 * .done(function(p1,p2){
 *  //p1或p2是数组对象，存放的数据依次为[ data, status, jqxhr ]
 * })
 *
 * 顺序调用
 *
 * var promise1  = $.jget(url,data)
 * var promise2 = req1.then(function(url,data){
 *  return   $.axGet(url,data);
 * })
 *var promise3 = then(function(url,data){
 *  return  * $.axGet(url,data);
 * })
 * promise3.done(function(data){
 *
 *  });
 *
 * 1.ajaxStart(全局事件)
 * 2.beforeSend
 * 3.ajaxSend(全局事件)
 * 4.success
 * 5.ajaxSuccess(全局事件)
 * 6.error
 * 7.ajaxError (全局事件)
 * 8.complete
 * 9.ajaxComplete(全局事件)
 * 10.ajaxStop(全局事件)
 *
 */
$(function(){
    //判断是否存在layer
    var hasLayer = !(typeof layer == "undefined");
    //当前layer加载层索引
    var loadLayerIdx = null;
    //是否开发这模式
    var dev = true;

    //消息提示组件配置参数
    toastr.options =  {
        closeButton: true,
        debug: false,
        progressBar:true,//显示进度条
        positionClass: "toast-top-right",
        onclick: null,
        showDuration: "1000",//显示动作（从无到有这个动作）持续的时间
        hideDuration: "1000",//隐藏动作持续的时间
        timeOut: "3000",//时间间隔
        extendedTimeOut: "2000",//延长显示时间
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    //成功消息通知
    var okNotice = function(msg_) {
        return  toastr.success(msg_);
    };
    //错误消息通知
    var errNotice = function(msg_,code_,detail_) {
        var title  =  (code_  ?   '错误码： ' + code_ : errNotice);
        var callBack = null;
        if(dev) {
            //回调函数显示错误堆栈信息
            callBack = function () {

                //清空错误堆栈信息
                var $errorStack = $('#error_stack');
                $errorStack.text("");

                var codeLayer = layer.open({
                    type: 1,
                    maxmin: true,
                    area: ['500px', '300px'],
                    title: '错误堆栈信息',
                    closeBtn: 1,
                    shadeClose: true,
                    content: $errorStack
                });
                //创建代码高亮组件
                var editor = CodeMirror($errorStack[0], {
                    lineNumbers: true,//是否显示行号
                    matchBrackets: true,
                    mode:"text/x-java",
                    theme:"3024-night",
                    readOnly:true,
                    lineWrapping:true,
                });
                editor.setValue(detail_);
                layer.full(codeLayer);
            }
        }
        return toastr.error(msg_,title,{
            timeOut:5000,
            onclick:callBack
        });
    };
    /**
     * 全局默认设置
     */
    jQuery.ajaxSetup({
        cache: false
    });

    /**
     * 每当一个Ajax请求即将发送，jQuery就会触发ajaxSend事件
     */
    jQuery(document).ajaxSend(function(e,xhr, options) {
        if(hasLayer && !loadLayerIdx) {
            loadLayerIdx = layer.load(1, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
        }
    });

    /**
     * 每当一个Ajax请求完成后执行
     */
    jQuery(document).ajaxComplete(function(e,xhr,options) {
        //关闭加载层
        if(hasLayer) {
            if(loadLayerIdx) {
                layer.close(loadLayerIdx);
                loadLayerIdx = null;
            }
        }
    });

    /**
     * 每当一个Ajax请求成功完成
     */
    jQuery(document).ajaxSuccess(function(e, xhr, options) {
        try {
            var rsp = xhr.responseText;
            if(rsp) {
                var data = $.parseJSON(rsp);
                //业务状态码
                var code_ = data["code_"] || "";
                //消息
                var msg_ = data["msg_"] || "";
                //错误详细（如错误堆栈信息）
                var detail_ = data["detail_"] || "";
                //是否忽略（true 则不提示）
                var  ignore_ =  data["ignore_"] || false;

                //是否忽略提示
                if(!ignore_) {
                    //状态0标识业务处理成功
                    if(0 == code_ || "0" == code_) {
                        okNotice(msg_);
                    } else {
                        errNotice(msg_,code_,detail_);
                    }
                }
            }
        } catch(err) {
            if(console) {
                console.error(err);
            }
        } finally {
        }
    });


    jQuery(document).ajaxError(function(e, xhr, options) {
        var rsp = xhr.responseText;
        //判断返回的是否html字符串
        var isTextHtml = true;
        //获取服务器返回的文档类型
        var contentType = xhr.getResponseHeader('content-type') || '';
        if(contentType.indexOf("application/json") > -1) {
            isTextHtml = false;
        }

        if(rsp) {
            if(isTextHtml) {
                layer.open({
                    type: 1,
                    area: ['500px', '300px'],
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    content: rsp
                });
            } else {
                var data = $.parseJSON(rsp);
                //业务状态码
                var code_ = data["code_"] || "";
                //消息
                var msg_ = data["msg_"] || "";

                var detail_ = data["detail_"] || "";
                errNotice(msg_,code_,detail_);
            }
        }
    });

    /**
     * get操作
     * @param url
     * @param data
     * @returns {*|{url, data}|{url, type, timeout, data, dataSrc, error}}
     */
    jQuery.axGet = function(url, data) {
        return jQuery.ajax({
            url:url,
            type:"get",
            async:false,
            contentType:"application/json; charset=UTF-8",
            dataType:"json",
            data:data
        });
    }

    /**
     * post操作，以json方式传参
     * @param url
     * @param data
     * @returns {*|{url, data}|{url, type, timeout, data, dataSrc, error}}
     */
    jQuery.axPost = function(url, data) {
        return jQuery.ajax({
            url:url,
            type:"post",
            async:false,
            contentType:"application/json; charset=UTF-8",
            dataType:"json",
            data:JSON.stringify(data)
        });
    }

    /**
     * put操作以JSON方式传参
     * @param url
     * @param data
     * @returns {*|{url, data}|{url, type, timeout, data, dataSrc, error}}
     */
    jQuery.axPut = function(url, data) {
        return jQuery.ajax({
            url:url,
            type:"put",
            contentType:"application/json; charset=UTF-8",
            dataType:"json",
            data:JSON.stringify(data)
        });
    }

    /**
     * 删除操作，以json方式传参
     * @param url 请求路径
     * @param data json数据
     * @returns  jqXHR 对象
     */
    jQuery.axDelete = function(url, data) {
        return jQuery.ajax({
            url:url,
            type:"delete",
            contentType:"application/json; charset=UTF-8",
            //禁止json对象数据转换为查询字符串格式
            dataType:"json",
            data:JSON.stringify(data)
        });
    }

    /**
     * 文件下载(GET请求)
     * @param url 请求路径
     * @param data 请求参数
     */
    jQuery.axDownload = function(url, data) {
        $.fileDownload(url, {
            data:data
        }).done(function (data_) {})
          .fail(function (data_) {
              data_ = JSON.parse((data_ || "{}"));
              //业务状态码
              var code_ = data_["code_"] || "";
              //消息
              var msg_ = data_["msg_"] || "";

              var detail_ = data_["detail_"] || "";
              errNotice(code_,msg_,detail_);
          });
    }
});