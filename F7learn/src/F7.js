/**
 * Created by Magee Yang on 2015/11/9.
 * 自学材料
 * 设置use strict 采用严格模式
 * 同时针对framework7的程序采用立刻执行的方式(function(){})();
 */

'use strict';

(function () {
    /**
     * Framework7
     */

    window.Framework7 = function (params) {
        //定义一个app对象,并赋予this，即app对象是整个Framework7本身，这样可以调用原型方法
        var app = this;

        //定义该框架的版本
        app.version = '1.0.0';

        //框架创建时的默认参数
        app.params = {
            cache: true, /** 默认采用通过缓存的方法使用Ajax加载HTML页面 */
            cacheIgnore: [], /** 配置不使用缓存的url数组 */
            cacheIgnoreGetParameters: false, /** 缓存时是否忽略参数，true则忽略参数 */
            cacheDuration: 1000 * 60 * 10, /** 配置缓存的持续时间，默认是10分钟 */


            externalLinks: '.external', /** Css 选择器，控制是否是外部链接，将取消框架默认的Ajax页面加载效果*/


            init: true, /** 默认自动开始初始化方法*/
        };

        //获取用户的配置参数并添加到参数对象中，如果参数名一样则覆盖，不存在则创建
        for (var param in params) {
            app.params[param] = params[param];
        }

        var $ = Dom7;

        //模板库变量(没有添加变量)
        //var t7 = Template7;
        //app._compiledTemplates = {};

        //触摸事件,根据获取到设备触摸支持情况，确定触摸事件类型为touch还是mouse
        app.touchEvents = {
            start: app.support.touch ? 'touchstart' : 'mousedown',
            move: app.support.touch ? 'touchmove' : 'mousemove',
            end: app.support.touch ? 'touchend' : 'mouseup',
        };

        //创建用于本地数据存储的对象
        app.ls = window.localStorage;

        //处理RTL页面由右向左的排版格式，如果direction设置为rtl，则进行属性设置
        app.rtl = $('body').css('direction') === 'rtl';
        if (app.rtl) $('html').attr('dir', 'rtl');


        /**
         * 处理单击事件，实现link，button等元素的单击事件及效果
         * 对于页面切换则屏蔽web默认的切换实现Ajax页面加载和滑动切换效果
         */
        app.initClickEvents = function () {
            function handleClicks(e) {
                var clicked = $(this);
                var url = clicked.attr('href');
                var isLink = clicked[0].nodeName.toLowerCase() === 'a';

                //如果是link同时如果包含外部链接的css属性或者url为javascript语句则通过window.open进行打开
                if (isLink) {
                    if (clicked.is(app.params.externalLinks) || (url && url.indexOf('javascript:') >= 0)) {
                        if (url && clicked.attr('target') === '_system') {
                            e.preventDefault();
                            window.open(url, '_system');
                        }
                        return;
                    }
                }

                var clickedData = clicked.getDataset(); //获取元素的所有data属性
                var isTabLink;


                if (isLink) {
                    e.preventDefault();  //通知 Web 浏览器不要执行与事件关联的默认动作(如果存在这样的动作)
                }
                var validUrl = url && url.length > 0 && url !== "#" && !isTabLink;
                var template = clickedData.template;
                console.log(clickedData);
                if(validUrl || clicked.hasClass('back') || template){
                    console.log('--------');
                }


            }

            $(document).on('click', 'a', handleClicks);

        };

        //初始化方法
        app.init = function () {
            //初始化点击事件，实现自定义的link，button点击效果及页面切换效果，屏蔽web默认的页面加载，实现Ajax页面加载
            if (app.initClickEvents) app.initClickEvents();


        };

        if (app.params.init)app.init();
        return app;
    };

})();


/**
 * 定义Framework7是否支持触摸
 */
Framework7.prototype.support = (function () {
    var support = {
        touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
    };
    // Export object
    return support;
})();


/**
 * Dom7 自定义Dom用来操作HTML元素
 */
var Dom7 = (function () {
    //通过$方法获取HTML上的元素element
    var $ = function (selector, context) {
        // arr存放Element的数组
        var arr = [], i = 0;
        //如果context为空，同时selector本身就是Dom7对象则直接返回
        if (selector && !context) {
            if (selector instanceof Dom7) return selector;
        }
        //如果selector不为空，则进行进一步的判断其是什么类型
        if (selector) {
            if (typeof selector === 'string') {
                var els, tempParent, html = selector.trim();//trim()是去掉字符串左右两端的空格
                if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) { //如果是包含<>HTML标签的字符串则特殊处理，如果没有匹配上则arr为空
                    var toCreate = 'div'; //默认为DIV标签
                    if (html.indexOf('<li') === 0) toCreate = 'ul';
                    if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                    if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                    if (html.indexOf('<tbody') === 0) toCreate = 'table';
                    if (html.indexOf('<option') === 0) toCreate = 'select';
                    tempParent = document.createElement(toCreate); //指定名称创建一个元素
                    tempParent.innerHTML = selector;//这里发现innerHTML后如果selector的标签不完整则自动补齐，例如selector='<tr>'后面会自动添加</tr>
                    //然后对重新整理过的tempParent进行循环处理
                    for (i = 0; i < tempParent.childNodes.length; i++) {
                        arr.push(tempParent.childNodes[i]);
                    }
                } else {
                    //如果上下文为空，selector以#开头同时不包含‘.空格<>:~’这些符号中的任何一个
                    if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                        //则该selector是标签ID的属性值，直接通过id进行获取Element
                        els = document.getElementById(selector.split('#')[1]);
                        arr.push(els);
                    } else {
                        //如果传递了上下文则在上下文中查找，如果没有则直接从document里查找所有匹配CSS选择器的元素节点列表,
                        //需要注意的是这里查找CSS需要带.才可以，不能直接用名字，要不然查询不到
                        els = (context || document).querySelectorAll(selector);
                        for (i = 0; i < els.length; i++) {
                            if (els[i])arr.push(els[i]);
                        }
                    }


                }

            }
            else if (selector.nodeType || selector === window || selector === document) {
                //如果selector本身就是HTML元素节点，或者是window及document,直接放入arr数组
                arr.push(selector);
            }
            else if (selector.length > 0 && selector[0].nodeType) {
                //如果selector是元素节点数组则循环并push到arr数组中
                for (i = 0; i < selector.length; i++) {
                    arr.push(selector[i]);
                }
            }
        }

        return new Dom7(arr);
    };

    var Dom7 = function (arr) {
        //把获取的元素节点放到this数组中，并返回
        var _this = this;
        for (var j = 0; j < arr.length; j++) {
            _this[j] = arr[j];
        }
        _this.length = arr.length;
        return this;
    };

    /**-------------------------------
     * 定义Dom7的原型方法
     * @type {{}}
     ---------------------------------*/
    Dom7.prototype = {
        /**
         * 一个参数并且是字符串则获取默认第一个元素的属性值
         * 两个参数attrs是字符串则对所有的元素进行属性的赋值操作
         * attrs是对象则根据对象的key-value对所有的元素进行属性的赋值操作
         * @param attrs  属性名称或者对象
         * @param value  属性对应的值
         * @returns {*}
         */
        attr: function (attrs, value) {
            if (arguments.length === 1 && typeof attrs === 'string') {
                //如果是一个参数，并且attrs是字符串，则直接获取默认第一个元素的attrs属性值
                if (this[0]) return this[0].getAttribute(attrs);
                else return undefined;
            } else {
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2 && typeof  attrs === 'string') {
                        this[i].setAttribute(attrs, value);
                    } else {
                        for (var attrName in attrs) {
                            this[i][attrName] = attrs[attrName]; //不清楚为什么还要这样写一遍
                            this[i].setAttribute(attrName, attrs[attrName]);
                        }
                    }
                }
                return this;
            }
        },
        /**
         * 获取元素的所有data属性keyvalue的对象
         * @returns {*}
         */
        getDataset: function () {
            var el = this[0];
            if (el) {
                var dataset = {};
                if (el.dataset) {
                    for (var datakey in el.dataset) {
                        dataset[datakey] = el.dataset[datakey];
                    }
                } else {
                    for (var i = 0; i < el.attributes.length; i++) {
                        var attr = el.attributes[i];
                        if (attr.name.indexOf('data-') >= 0) {
                            dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                        }
                    }
                }
                //对data属性值的特殊字符串进行转换，数字字符串转换成数字，true和false转换成boolean型值
                for (var key in dataset) {
                    if (dataset[key] === 'false') dataset[key] = false;
                    else if (dataset[key] === 'true') dateset[key] = true;
                    else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
                }
                return dataset;
            } else {
                return undefined;
            }
        },
        /**
         * 传递props字符串一个参数则获取默认第一个元素的css样式对应的值
         * 传递props样式对象，则根据对象对所有的元素进行CSS样式设置
         * 传递props和value两个参数，props为字符串则根据value对所有的元素CSS样式值设置
         * @param props CSS样式名称或者对象
         * @param value CSS样式对应的值
         * @returns {*}
         */
        css: function (props, value) {
            var i;
            if (arguments.length === 1) {
                if (typeof props === 'string') {
                    if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                } else {
                    //如果是key-value对象则进行css样式设置,并返回Element对象
                    for (i = 0; i < this.length; i++) {
                        for (var prop in props) {
                            this[i].style[prop] = props[prop];
                        }
                    }
                    return this;
                }

            }
            if (arguments.length === 2 && typeof props === 'string') {
                //如果参数为两个，并且props是字符串，则根据props值进行css样式设置，props属性值为value
                for (i = 0; i < this.length; i++) {
                    this[i].style[props] = value;
                }
                return this;
            }
            return this;
        },
        /**
         * 判断元素是否在class中包含参数值
         * 通过调用标准API的classList获取当前元素的所有css样式属性值，并判断是否包含传递参数className的值
         * @param className CSS样式名称
         * @returns {boolean}
         */
        hasClass: function (className) {
            if (!this[0]) return false;
            else return this[0].classList.contains(className);
        },
        /**
         * 默认对第一个元素进行判断，判断是不是selector的元素
         * @param selector  CSSselector
         * @returns {boolean}
         */
        is: function (selector) {
            if (!this[0] || typeof selector === 'undefined') return false;
            var compareWith, i;
            if (typeof selector === 'string') {
                var el = this[0];
                if (el === window || el === document) return false; //如果是selector是字符串，而el是document或window则直接返回false，肯定不匹配
                if (el.matches) return el.matches(selector);  //如果元素是由选择器选择指定的字符串则返回true
                //matchesSelector用来匹配dom元素是否匹配某css selector，每一个版本的浏览器均实现了这个方法，但都带上了自带的前缀
                else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector); //chrome/safari
                else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector); //firefox
                else if (el.msMatchesSelector) return el.msMatchesSelector(selector); //IE9+
                else {
                    compareWith = $(selector);
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0])return true;
                    }
                    return false;
                }
            }
            else if (selector === document) return this[0] === document;
            else if (selector === window) return this[0] === window;
            else {
                if (selector.nodeType || selector instanceof Dom7) {
                    compareWith = selector.nodeType ? [selector] : selector;
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0])return true;
                    }
                    return false;
                }
            }

        },
        /**
         * 给元素增加事件监听，并可以通过targetSelector对事件的执行元素进行过滤控制
         * @param eventName  事件名称
         * @param targetSelector 如果是函数则是事件的执行函数，如果不是则是目标元素
         * @param listener 事件的执行函数
         * @param capture  冒泡标识 false从里到外，true从外到里
         * @returns {Dom7}
         */
        on: function (eventName, targetSelector, listener, capture) {
            function handleLiveEvent(e) {
                //call(target,e)用两个参数是因为如果target是父节点则可以通过这两个参数区分
                var target = e.target;
                if ($(target).is(targetSelector)) listener.call(target, e);
                else {
                    var parents = $(target).parents();
                    for (var k = 0; k < parents.length; k++) {
                        if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                    }
                }

            };
            var events = eventName.split(' ');
            var i, j;
            for (i = 0; i < this.length; i++) {
                if (typeof targetSelector === 'function' || targetSelector === false) {
                    //这里处理一般正常的事件设置方式
                    if (typeof  targetSelector === 'function') {
                        listener = arguments[1];
                        capture = arguments[2] || false;
                    }
                    for (j = 0; j < events.length; j++) {
                        this[i].addEventListener(events[j], listener, capture);
                    }
                } else {
                    //这里处理targetSelector为多个元素的特殊动态处理事件
                    for (j = 0; j < events.length; j++) {
                        if (!this[i].dom7LiveListener) this[i].dom7LiveListener = [];
                        this[i].dom7LiveListener.push({listener: listener, livelistener: handleLiveEvent});
                        this[i].addEventListener(events[j], handleLiveEvent, capture);
                    }
                }
            }
            return this;
        },
        /**
         * 如果参数为空则获取元素的所有父节点，如果有参数则返回元素父节点包含CssSelector的节点
         * @param selector CSSselector
         * @returns {$}
         */
        parents: function (selector) {
            var parents = [];
            for (var i = 0; i < this.length; i++) {
                var parent = this[i].parentNode;
                while (parent) {
                    if (selector) {
                        if ($(parent).is(selector)) parents.push(parent);
                    } else {
                        parents.push(parent);
                    }
                    parent = parent.parentNode;
                }
            }
            return $($.unique(parents));
        },
    };


    /**------------------------
     * $的自身方法
     -------------------------*/
    /**
     * 把用-区分开的单词转换成连接在一起的驼峰式字符串
     * 正则表达式/-(.)/g表示匹配-符号后面任何一个字符
     * @param string
     * @returns {string}
     */
    $.toCamelCase = function (string) {
        return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    };
    /**
     * 实现对arr对象数组进行重复数据过滤，最终只保留不重复独一无二的对象数据
     * @param arr 对象数组
     * @returns {Array}
     */
    $.unique = function (arr) {
        var unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1)unique.push(arr[i]);
        }
        return unique;
    };


    return $;
})();

