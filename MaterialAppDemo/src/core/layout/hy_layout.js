/**
 * 编写Layout布局指定
 * @author Administrator
 */

(function() {
    //这里定义的变量只在当前范围内有效
    'use strict';
    var $mdUtil, $interpolate;
    var SUFFIXES = /(-gt)?-(sm|md|lg)/g;
    var WHITESPACE = /\s+/g;
    var FLEX_OPTIONS = ['grow', 'initial', 'auto', 'none'];
    var LAYOUT_OPTIONS = ['row', 'column'];
    //正则表达式  \s表示空格，+表示一个或多个，/g表示全局，整体就是要替换一个或多个空格
    var config = {
        enabled : true, //控制该指令是否有效
        removeAttributes : true //通过属性生成class后，是否移除原有属性
    };

    /**
     * 创建一个layout的模块
     */
    angular.module('hyMaterial.core.layout', ['ng'])
    .directive('layout', attributeWithOberve('layout'))
    .directive('flex', attributeWithOberve('flex'))
    .directive('layoutWrap', attributeWithoutValue('layout-wrap'));

    /**
     * 创建一个对动态属性进行处理的指令注册函数
     * @param {Object} className
     */
    function attributeWithOberve(className) {
       
        return ['$interpolate',
        function(_$interpolate_) {
            $interpolate = _$interpolate_;
            return {
                restrict : 'A',
                compile : function(element, attr) {
                    var linkFn;
                    if (config.enabled) {
                        validateAttributeValue(className, getNormalizedAttrValue(className, attr, ""), buildUpdateFn(element, className, attr));
                    }
                    linkFn = translateWithValueToCssClass;
                    return linkFn || angular.noop;
                }
            };
        }];
        /**
         * 增加一个css的属性，并移除原有的属性值
         */
        function translateWithValueToCssClass(scope, element, attrs) {
            var updateFn = updateClassWithValue(element, className, attrs);
            var unwatch = attrs.$observe(attrs.$normalize(className), updateFn);

            updateFn(getNormalizedAttrValue(className, attrs, ""));
            scope.$on("$destroy", function() {
                console.log('layout-destory is begin');
                unwatch()
            });

            if (config.removeAttributes)
                element.removeAttr(className);
        }

    }

    /**
     * 创建Layout布局指令的属性注册函数
     * 这是一个简单的转换属性成为类的函数
     */
    function attributeWithoutValue(className) {
        return ['$interpolate',
        function(_$interpolate_) {
            $interpolate = _$interpolate_;
            return {
                restrict : 'A',
                compile : function(element, attr) {
                    var linkFn;
                    if (config.enabled) {
                        validateAttributeValue(className, getNormalizedAttrValue(className, attr, ""), buildUpdateFn(element, className, attr));
                        translateToCssClass(null, element);
                        linkFn = translateToCssClass;
                    }

                    return linkFn || angular.noop;
                }
            };
        }];

        /**
         * 转换，增加类属性，并移除原有的属性
         */
        function translateToCssClass(scope, element) {
            element.addClass(className);
            if (config.removeAttributes) {
                element.removeAttr(className);
            }
        }

    }

    function updateClassWithValue(element, className) {
        var lastClass;

        return function updateClassFn(newValue) {
            var value = validateAttributeValue(className, newValue || "");
            if (angular.isDefined(value)) {//判断value对象是否被定义过
                if (lastClass) {
                    element.removeClass(lastClass);
                }
                lastClass = !value ? className : className + "-" + value.replace(WHITESPACE, "-");
                element.addClass(lastClass);
            }
        };
    }

    /**
     * 设置layout的默认属性值，有效或者用fallback函数替代
     */
    function validateAttributeValue(className, value, updateFn) {
        var origValue = value;

        if (!needsInterpolation(value)) {
            switch (className.replace(SUFFIXES,"")) {
            case 'layout'        :
                if (!findIn(value, LAYOUT_OPTIONS)) {
                    value = LAYOUT_OPTIONS[0];
                    // layout的默认属性是'row';
                }
                break;

            case 'flex'          :
                if (!findIn(value, FLEX_OPTIONS)) {
                    if (isNaN(value)) {//isNaN是js标准函数，检查参数是否是非数字型，如果是非数字型则为true，如果是数字型则为false
                        value = '';
                    }
                }
                break;

            case 'flex-offset' :
            case 'flex-order'    :
                if (!value || isNaN(+value)) {
                    value = '0';
                }
                break;

            case 'layout-align'  :
                if (!findIn(value, ALIGNMENT_OPTIONS, "-")) {
                    value = ALIGNMENT_OPTIONS[0];
                    // 'start-start';
                }
                break;

            case 'layout-padding' :
            case 'layout-margin'  :
            case 'layout-fill'    :
            case 'layout-wrap'    :
            case 'layout-no-wrap' :
                value = '';
                break;
            }

            if (value != origValue) {
                (updateFn || angular.noop)(value);
            }
        }
        return value;
    }

    /**
     * 更新元素的属性值为返回值
     */
    function buildUpdateFn(element, className, attrs) {
        return function updateAttrValue(fallback) {
            if (!needsInterpolation(fallback)) {
                element.attr(className, fallback);
                attrs[attrs.$normalize(className)] = fallback;
            }
        };
    }

    /**
     * 判断value里是不是包含angular的注入器字符串，$interpolate.startSymbol()的值是{{,$interpolate.endSymbol()的值是}}
     * 包含返回true;不包含返回false
     */
    function needsInterpolation(value) {
        return (value || "").indexOf($interpolate.startSymbol()) > -1;
    }

    /**
     * 通过className获取其属性值，先对className进行正规化处理，然后获取属性值，如果中间有空格则用-符号进行间隔
     * @param {Object} className
     * @param {Object} attrs
     * @param {Object} defaultVal
     */
    function getNormalizedAttrValue(className, attrs, defaultVal) {
        var normalizedAttr = attrs.$normalize(className);
        return attrs[normalizedAttr] ? attrs[normalizedAttr].replace(WHITESPACE, "-") : defaultVal || null;
    }

    /**
     * 判断item在不在list数组中
     * @param {Object} item
     * @param {Object} list
     * @param {Object} replaceWith
     */
    function findIn(item, list, replaceWith) {
        item = replaceWith && item ? item.replace(WHITESPACE, replaceWith) : item;

        var found = false;
        if (item) {
            list.forEach(function(it) {
                it = replaceWith ? it.replace(WHITESPACE, replaceWith) : it;
                found = found || (it === item);
            });
        }
        return found;
    }

})();

