import xhtml from './services/xhtml';

/**
 * 表单校验【配置文件】
 * -------------------------
 * 表单校验分为三部分：
 * 1.自定义交易规则和具体的提示信息等配置，也就是本文件
 *
 * 2.定义了规则以后，应用在form上，由指令v-input-check实现
 * 文件位置：src/directive/input-check.js
 *
 * 3.规则应用以后，需要获取当前表单合法性，由全局方法this.$error(formname)提供
 * 文件位置：src/service/input-check.js
 *
 * 另外，表单和具体的输入框上通过class记录着校验的具体结果，可以在定义样式的时候使用。
 */

// 自定义校验规则
export default {

    // 1.required:flag
    "required": function (el, val, flag) {
        let pEl = el.parentNode;

        if (flag === 'false' || flag === false) {

            // 如果不是必输，去掉红星标志
            if (xhtml.hasClass(pEl, 'required-red-star')) xhtml.removeClass(pEl, 'required-red-star');

            return true;
        } else {

            // 如果是必输，添加红星标志
            if (!xhtml.hasClass(pEl, 'required-red-star')) xhtml.addClass(pEl, 'required-red-star');

            if (val && !/^ +$/.test(val)) {
                return true;
            }
        }
        return false;
    },

    //  2.select
    "select": function (el, val) {
        return !/undefined$/.test(val.trim());
    },

    // 3.maxLength:num
    "maxLength": function (el, val, num) {
        val = (val + "").trim();
        return val.length <= num;
    },

    // 4.minLength:num
    "minLength": function (el, val, num) {
        val = (val + "").trim();
        return val.length >= num;
    },

    // 5.regexp:str
    "regexp": function (el, val, str) {
        el._validate_regexp = str;
        return new RegExp(str).test(val);
    }

};

// 自定义错误提示
// 请和上面的对应起来，上面未定义的采用默认提示
export let errorinfo = [

    // 1.必输
    ["required", function (el, name) {
        return name + "是必输项！";
    }],

    // 2.下拉
    ["select", function (el, name) {
        return name + "下拉key非法！";
    }],

    // 3.最大长度
    ["maxLength", function (el, name) {
        return name + "超过最大长度！";
    }],

    // 4.最短长度
    ["minLength", function (el, name) {
        return name + "短于最短长度！";
    }],

    // 5.正则表达式
    ["regexp", function (el, name) {
        return name + "不满足正则表达式：" + el._validate_regexp;
    }]

];
