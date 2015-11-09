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
        //定义一个app对象,并赋予this，即app对象是整个Framework7本身，可以调用原型方法
        var app = this;

        //定义该框架的版本
        app.version = '1.0.0';

        //框架创建时的默认参数
        app.params = {
            cache: true,  /** 默认采用通过缓存的方法使用Ajax加载HTML页面 */
            cacheIgnore: [],  /** 配置不使用缓存的url数组 */
            cacheIgnoreGetParameters: false, /** 缓存时是否忽略参数，true则忽略参数 */
            cacheDuration: 1000*60*10,  /** 配置缓存的持续时间，默认是10分钟 */
        };

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






