/**
 * @author zhangliang
 */
/**
 * description
 * @return {Date} 回填数据
 */

$.fn.extend({
    //表单加载json对象数据
    setForm: function (jsonValue) {

        var obj = this;
        for (var name in jsonValue) {

            var value = jsonValue[name];
            if ("" == value || null == value) continue;

            var $oinput = obj.find("input[name=" + name + "]");
            if ($oinput.attr("type") == "checkbox") {
                if (value !== null) {
                    var checkboxObj = $("[name=" + name + "]");
                    if (typeof(value) == "number") {
                        $(checkboxObj[0]).prop('checked',true);
                    } else {
                        var checkArray = value.split(";");
                        for (var i = 0; i < checkboxObj.length; i++) {
                            for (var j = 0; j < checkArray.length; j++) {
                                if (checkboxObj[i].value == checkArray[j]) {
                                    $(checkboxObj[0]).prop('checked',true);
                                }
                            }
                        }
                    }
                }
            }
            else if ($oinput.attr("type") == "radio") {
                $oinput.each(function () {
                    var radioObj = $("[name=" + name + "]");
                    for (var i = 0; i < radioObj.length; i++) {
                        if (radioObj[i].value == value) {
                            $(radioObj[i]).prop('checked',true);
                        }
                    }
                });
            }
            else if ($oinput.attr("type") == "textarea") {
                obj.find("[name=" + name + "]").html(value);
            }
            else {
                obj.find("[name=" + name + "]").val(value);
            }
        }

    }
});