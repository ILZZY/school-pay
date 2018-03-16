/*
 Created on 3/15/2018  
 Author: zhangliang
 Description: homepage.js
*/

var homepageMVC = {
    Common: {},
    Init: function () {
        homepageMVC.View.resetIfreamSize();
        homepageMVC.View.bindEvent();
    },
    View: {
        setSidebar: function () {

        },
        /*重新设置iframe的大小*/
        resetIfreamSize: function () {
            var container = $("#ifr-container-id");
            var iframe = $("#iframe-id");
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();

            container.prop('style').height = windowHeight-50-62+"px";
        },
        bindEvent: function () {
            /*登出点击事件*/
            $("#logout").on("click",function () {
                homepageMVC.Action.logout();
            })
            /*菜单点击事件*/
            $(".sub-menu").on('click','li',function () {
                var _this = $(this);
                var tmp = _this.attr('data-href');
                homepageMVC.View.resetIfreamSize();

                /*设置导航标签指示栏*/
                $("ul.page-breadcrumb li:eq(1) span").text($(this).find("span.title").text());

                /*设置iframe地址*/
                $("#iframe-id").attr('src',"GETAPAGE?"+tmp);
                console.log($("#iframe-id").attr('src'));
            })
        }
    },
    Action: {
        logout: function () {
            $.ajax({
                type: "get",
                url: "/logout",
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    location.reload(true);
                }
            });
        }
    },
}

//函数入口
$(function () {
    homepageMVC.Init();
})