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

            allowDuplicateUrls: false, /**设置是否允许在当前active页面中对同一个地址进行加载*/

            swipeBackPage: false, /** 默认滑动返回效果*/
            swipeBackPageThreshold: 0,
            swipeBackPageActiveArea: 30,
            swipeBackPageAnimateShadow: true,
            swipeBackPageAnimateOpacity: true,

            externalLinks: '.external', /** Css 选择器，控制是否是外部链接，将取消框架默认的Ajax页面加载效果*/

            // 默认视图定义
            viewClass: 'view',
            viewMainClass: 'view-main',
            viewsClass: 'views',

            material: false,

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


        /*=======================================
         *********** Views ***********************
         ========================================= */
        app.views = [];
        var View = function (selector, params) {
            var defaults = {
                dynamicNavbar: false,   //动态导航参数属性
                domCache: false,        //Dom缓存,true则把上一页都放到缓存中
                linksView: undefined,   //View选择器，默认所有页面都加载到当前View里，这里可以指定一个其他的View
                reloadPages: false,
                uniqueHistory: app.params.uniqueHistory,
                uniqueHistoryIgnoreGetParameters: app.params.uniqueHistoryIgnoreGetParameters,
                allowDuplicateUrls: app.params.allowDuplicateUrls,
                swipeBackPage: app.params.swipeBackPage,
                swipeBackPageAnimateShadow: app.params.swipeBackPageAnimateShadow,
                swipeBackPageAnimateOpacity: app.params.swipeBackPageAnimateOpacity,
                swipeBackPageActiveArea: app.params.swipeBackPageActiveArea,
                swipeBackPageThreshold: app.params.swipeBackPageThreshold,
                animatePages: app.params.animatePages,
                preloadPreviousPage: app.params.preloadPreviousPage,
            };

            var i;
            params = params || {};
            //Android主题不支持动态导航，需要设置为false
            if (params.dynamicNavbar && app.params.material) params.dynamicNavbar = false;

            for (var def in defaults) {
                if (typeof params[def] === 'undefined') {
                    params[def] = defaults[def];
                }
            }

            var view = this;
            view.params = params;
            view.selector = selector;
            var container = $(selector);
            view.container = container[0];

            if (typeof selector !== 'string') {
                //如果selector是个Element或者Dom7对象
                selector = (container.attr('id') ? "#" + container.attr('id') : '') +
                    (container.attr('class') ? '.' + container.attr('class').replace(/ /g, '.').replace('.active', '') : '');
                view.selector = selector;
            }
            //判断该视图是否是主视图
            view.main = container.hasClass(app.params.viewMainClass);
            //定义内容缓存和页面缓存
            view.contentCache = {};
            view.pageCache = {};
            //保存视图到元素中以方便访问
            container[0].f7View = view;

            view.pagesContainer = container.find('.pages')[0];
            view.initialPages = [];
            view.initialPagesUrl = [];
            view.initialNavbars = [];
            if (view.params.domCache) {
                var initialPages = container.find('.page');
                for (i = 0; i < initialPages.length; i++) {
                    view.initialPages.push(initialPages[i]);
                    view.initialPagesUrl.push('#' + initialPages.eq(i).attr('data-page'));
                }
                if (view.params.dynamicNavbar) {
                    var initialNavbars = container.find('.navbar-inner');
                    for (i = 0; i < initialNavbars.length; i++) {
                        view.initialNavbars.push(initialNavbars[i]);
                    }
                }
            }

            view.allowPageChange = true;  //目前不清楚这个变量的作用

            var docLocation = document.location.href;

            //没有写完
            view.history = [];
            var viewURL = docLocation;


            //激活页面视图,如果找到多个page页面则默认获取最后一个页面作为当前页面
            var currentPage, currentPageData;
            if (!view.activePage) {
                currentPage = $(view.pagesContainer).find('.page-on-center');
                if (currentPage.length === 0) {
                    currentPage = $(view.pagesContainer).find('.page:not(.cached)');
                    currentPage = currentPage.eq(currentPage.length - 1);
                }
                if (currentPage.length > 0) {
                    currentPageData = currentPage[0].f7PageData;
                }
            }

            if (view.params.domCache && currentPage) {
                view.url = container.attr('data-url') || view.params.url || '#' + currentPage.attr('data-page');
                view.pageCache[view.url] = currentPage.attr('data-page');
            } else {
                view.url = container.attr('data-url') || view.params.url || viewURL;
            }

            //更新当前页面数据没有写


            //存储历史url
            if (view.url) {
                view.history.push(view.url);
            }

            //把视图添加到APP应用中
            app.views.push(view);
            if (view.main) app.mainView = view;

            //视图路由功能
            view.router = {
                load: function (options) {
                    app.router.load(view, options);
                },
                back: function (options) {
                    app.router.back(view, options);
                },
            };


            //返回视图
            return view;

        };

        app.addView = function (selector, params) {
            return new View(selector, params);
        };


        /*==================================
         ****** 导航和路由功能***************
         ==================================*/

        app.router = {
            //临时存放页面内容的DIV标签
            temporaryDom: document.createElement('div'),
            // Find page or navbar in passed container which are related to View
            findElement: function (selector, container, view, notCached) {
                container = $(container);
                if (notCached) selector = selector + ':not(.cached)';
                var found = container.find(selector);
                if (found.length > 1) {
                    if (typeof view.selector === 'string') {
                        // Search in related view
                        found = container.find(view.selector + ' ' + selector);
                    }
                    if (found.length > 1) {
                        // Search in main view
                        found = container.find('.' + app.params.viewMainClass + ' ' + selector);
                    }
                }
                if (found.length === 1) return found;
                else {
                    // Try to find non cached
                    if (!notCached) found = app.router.findElement(selector, container, view, true);
                    if (found && found.length === 1) return found;
                    else return undefined;
                }
            },
            preroute: function (view, options) {
                if ((app.params.preroute && app.params.preroute(view, options) === false) || (view && view.params.preroute && view.params.preroute(view, options) === false)) {
                    return true;
                } else {
                    return false;
                }
            },
            preprocess: function (view, content, url, next) {
                // Plugin hook
                //app.pluginHook('routerPreprocess', view, content, url, next);

                // Preprocess by plugin
                //content = app.pluginProcess('preprocess', content);

                if (view && view.params && view.params.preprocess) {
                    content = view.params.preprocess(content, url, next);
                    if (typeof content !== 'undefined') {
                        next(content);
                    }
                }
                else if (app.params.preprocess) {
                    content = app.params.preprocess(content, url, next);
                    if (typeof content !== 'undefined') {
                        next(content);
                    }
                }
                else {
                    next(content);
                }
            },


        };

        app.router._load = function (view, options) {
            options = options || {};

            var url = options.url,
                content = options.content, //initial content
                t7_rendered = {content: options.content},
                template = options.template, // Template 7 compiled template
                pageName = options.pageName,
                viewContainer = $(view.container),
                pagesContainer = $(view.pagesContainer),
                animatePages = options.animatePages,
                newPage, oldPage, pagesInView, i, oldNavbarInner, newNavbarInner, navbar, dynamicNavbar, reloadPosition,
                isDynamicPage = typeof url === 'undefined' && content || template,
                pushState = options.pushState;
            if (typeof animatePages === 'undefined') animatePages = view.params.animatePages;

            // Plugin hook
            //app.pluginHook('routerLoad', view, options);

            // Render with Template7
            if (app.params.template7Pages && typeof content === 'string' || template) {
                //t7_rendered = app.router.template7Render(view, options);
                if (t7_rendered.content && !content) {
                    content = t7_rendered.content;
                }
            }

            app.router.temporaryDom.innerHTML = '';
            // Parse DOM
            if (!pageName) {
                if ((typeof content === 'string') || (url && (typeof content === 'string'))) {
                    app.router.temporaryDom.innerHTML = t7_rendered.content;
                } else {
                    if ('length' in content && content.length > 1) {
                        for (var ci = 0; ci < content.length; ci++) {
                            $(app.router.temporaryDom).append(content[ci]);
                        }
                    } else {
                        $(app.router.temporaryDom).append(content);
                    }
                }
            }
            // Reload position
            reloadPosition = options.reload && (options.reloadPrevious ? 'left' : 'center');

            // Find new page
            if (pageName) newPage = pagesContainer.find('.page[data-page="' + pageName + '"]');
            else {
                newPage = app.router.findElement('.page', app.router.temporaryDom, view);
            }
            // If page not found exit
            if (!newPage || newPage.length === 0 || (pageName && view.activePage && view.activePage.name === pageName)) {
                view.allowPageChange = true;
                return;
            }

            newPage.addClass(options.reload ? 'page-on-' + reloadPosition : 'page-on-right');

            // Find old page (should be the last one) and remove older pages
            pagesInView = pagesContainer.children('.page:not(.cached)');
            if (options.reload && options.reloadPrevious && pagesInView.length === 1) {
                view.allowPageChange = true;
                return;
            }
            console.log(pagesInView.length);
            if (options.reload) {
                oldPage = pagesInView.eq(pagesInView.length - 1);
            }
            else {
                if (pagesInView.length > 1) {
                    for (i = 0; i < pagesInView.length - 2; i++) {
                        if (!view.params.domCache) {
                            //app.pageRemoveCallback(view, pagesInView[i], 'left');
                            $(pagesInView[i]).remove();
                        }
                        else {
                            $(pagesInView[i]).addClass('cached');
                        }
                    }
                    if (!view.params.domCache) {
                        //app.pageRemoveCallback(view, pagesInView[i], 'left');
                        $(pagesInView[i]).remove();
                    }
                    else {
                        $(pagesInView[i]).addClass('cached');
                    }
                }
                oldPage = pagesContainer.children('.page:not(.cached)');
            }
            if (view.params.domCache) newPage.removeClass('cached');

            console.log(oldPage);
            return false;

            // Dynamic navbar
            if (view.params.dynamicNavbar) {
                dynamicNavbar = true;
                // Find navbar
                if (pageName) {
                    newNavbarInner = viewContainer.find('.navbar-inner[data-page="' + pageName + '"]');
                }
                else {
                    newNavbarInner = app.router.findElement('.navbar-inner', app.router.temporaryDom, view);
                }
                if (!newNavbarInner || newNavbarInner.length === 0) {
                    dynamicNavbar = false;
                }
                navbar = viewContainer.find('.navbar');
                if (options.reload) {
                    oldNavbarInner = navbar.find('.navbar-inner:not(.cached):last-child');
                }
                else {
                    oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');

                    if (oldNavbarInner.length > 0) {
                        for (i = 0; i < oldNavbarInner.length - 1; i++) {
                            if (!view.params.domCache) {
                                app.navbarRemoveCallback(view, pagesInView[i], navbar[0], oldNavbarInner[i]);
                                $(oldNavbarInner[i]).remove();
                            }
                            else
                                $(oldNavbarInner[i]).addClass('cached');
                        }
                        if (!newNavbarInner && oldNavbarInner.length === 1) {
                            if (!view.params.domCache) {
                                app.navbarRemoveCallback(view, pagesInView[0], navbar[0], oldNavbarInner[0]);
                                $(oldNavbarInner[0]).remove();
                            }
                            else
                                $(oldNavbarInner[0]).addClass('cached');
                        }
                        oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');
                    }
                }
            }
            if (dynamicNavbar) {
                newNavbarInner.addClass(options.reload ? 'navbar-on-' + reloadPosition : 'navbar-on-right');
                if (view.params.domCache) newNavbarInner.removeClass('cached');
                newPage[0].f7RelatedNavbar = newNavbarInner[0];
                newNavbarInner[0].f7RelatedPage = newPage[0];
            }

            // save content areas into view's cache
            if (!url) {
                var newPageName = pageName || newPage.attr('data-page');
                if (isDynamicPage) url = '#' + app.params.dynamicPageUrl.replace(/{{name}}/g, newPageName).replace(/{{index}}/g, view.history.length - (options.reload ? 1 : 0));
                else url = '#' + newPageName;
                if (!view.params.domCache) {
                    view.contentCache[url] = content;
                }
                if (view.params.domCache && pageName) {
                    view.pagesCache[url] = pageName;
                }
            }

            // Push State
            if (app.params.pushState && !options.reloadPrevious && view.main) {
                if (typeof pushState === 'undefined') pushState = true;
                var pushStateRoot = app.params.pushStateRoot || '';
                var method = options.reload ? 'replaceState' : 'pushState';
                if (pushState) {
                    if (!isDynamicPage && !pageName) {
                        history[method]({
                            url: url,
                            viewIndex: app.views.indexOf(view)
                        }, '', pushStateRoot + app.params.pushStateSeparator + url);
                    }
                    else if (isDynamicPage && content) {
                        history[method]({
                            content: content,
                            url: url,
                            viewIndex: app.views.indexOf(view)
                        }, '', pushStateRoot + app.params.pushStateSeparator + url);
                    }
                    else if (pageName) {
                        history[method]({
                            pageName: pageName,
                            url: url,
                            viewIndex: app.views.indexOf(view)
                        }, '', pushStateRoot + app.params.pushStateSeparator + url);
                    }
                }
            }

            // Update View history
            view.url = url;
            if (options.reload) {
                var lastUrl = view.history[view.history.length - (options.reloadPrevious ? 2 : 1)];
                if (lastUrl && lastUrl.indexOf('#') === 0 && lastUrl in view.contentCache && lastUrl !== url) {
                    view.contentCache[lastUrl] = null;
                    delete view.contentCache[lastUrl];
                }
                view.history[view.history.length - (options.reloadPrevious ? 2 : 1)] = url;
            }
            else {
                view.history.push(url);
            }

            // Unique history
            var historyBecameUnique = false;
            if (view.params.uniqueHistory) {
                var _history = view.history;
                var _url = url;
                if (view.params.uniqueHistoryIgnoreGetParameters) {
                    _history = [];
                    _url = url.split('?')[0];
                    for (i = 0; i < view.history.length; i++) {
                        _history.push(view.history[i].split('?')[0]);
                    }
                }

                if (_history.indexOf(_url) !== _history.lastIndexOf(_url)) {
                    view.history = view.history.slice(0, _history.indexOf(_url));
                    view.history.push(url);
                    historyBecameUnique = true;
                }
            }
            // Dom manipulations
            if (options.reloadPrevious) {
                oldPage = oldPage.prev('.page');
                newPage.insertBefore(oldPage);
                if (dynamicNavbar) {
                    oldNavbarInner = oldNavbarInner.prev('.navbar-inner');
                    newNavbarInner.insertAfter(oldNavbarInner);
                }
            }
            else {
                pagesContainer.append(newPage[0]);
                if (dynamicNavbar) navbar.append(newNavbarInner[0]);
            }
            // Remove Old Page And Navbar
            if (options.reload) {
                if (view.params.domCache && view.initialPages.indexOf(oldPage[0]) >= 0) {
                    oldPage.addClass('cached');
                    if (dynamicNavbar) oldNavbarInner.addClass('cached');
                }
                else {
                    app.pageRemoveCallback(view, oldPage[0], reloadPosition);
                    if (dynamicNavbar) app.navbarRemoveCallback(view, oldPage[0], navbar[0], oldNavbarInner[0]);
                    oldPage.remove();
                    if (dynamicNavbar) oldNavbarInner.remove();
                }
            }

            // Page Init Events
            app.pageInitCallback(view, {
                pageContainer: newPage[0],
                url: url,
                position: options.reload ? reloadPosition : 'right',
                navbarInnerContainer: dynamicNavbar ? newNavbarInner && newNavbarInner[0] : undefined,
                oldNavbarInnerContainer: dynamicNavbar ? oldNavbarInner && oldNavbarInner[0] : undefined,
                context: t7_rendered.context,
                query: options.query,
                fromPage: oldPage && oldPage.length && oldPage[0].f7PageData,
                reload: options.reload,
                reloadPrevious: options.reloadPrevious
            });

            // Navbar init event
            if (dynamicNavbar) {
                app.navbarInitCallback(view, newPage[0], navbar[0], newNavbarInner[0], url, options.reload ? reloadPosition : 'right');
            }

            if (options.reload) {
                view.allowPageChange = true;
                if (historyBecameUnique) view.refreshPreviousPage();
                return;
            }

            if (dynamicNavbar && animatePages) {
                app.router.prepareNavbar(newNavbarInner, oldNavbarInner, 'right');
            }
            // Force reLayout
            var clientLeft = newPage[0].clientLeft;

            // Before Anim Callback
            app.pageAnimCallback('before', view, {
                pageContainer: newPage[0],
                url: url,
                position: 'right',
                oldPage: oldPage,
                newPage: newPage,
                query: options.query,
                fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
            });

            function afterAnimation() {
                view.allowPageChange = true;
                newPage.removeClass('page-from-right-to-center page-on-right page-on-left').addClass('page-on-center');
                oldPage.removeClass('page-from-center-to-left page-on-center page-on-right').addClass('page-on-left');
                if (dynamicNavbar) {
                    newNavbarInner.removeClass('navbar-from-right-to-center navbar-on-left navbar-on-right').addClass('navbar-on-center');
                    oldNavbarInner.removeClass('navbar-from-center-to-left navbar-on-center navbar-on-right').addClass('navbar-on-left');
                }
                app.pageAnimCallback('after', view, {
                    pageContainer: newPage[0],
                    url: url,
                    position: 'right',
                    oldPage: oldPage,
                    newPage: newPage,
                    query: options.query,
                    fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
                });
                if (app.params.pushState && view.main) app.pushStateClearQueue();
                if (!(view.params.swipeBackPage || view.params.preloadPreviousPage)) {
                    if (view.params.domCache) {
                        oldPage.addClass('cached');
                        oldNavbarInner.addClass('cached');
                    }
                    else {
                        if (!(url.indexOf('#') === 0 && newPage.attr('data-page').indexOf('smart-select-') === 0)) {
                            app.pageRemoveCallback(view, oldPage[0], 'left');
                            if (dynamicNavbar) app.navbarRemoveCallback(view, oldPage[0], navbar[0], oldNavbarInner[0]);
                            oldPage.remove();
                            if (dynamicNavbar) oldNavbarInner.remove();
                        }
                    }
                }
                if (view.params.uniqueHistory && historyBecameUnique) {
                    view.refreshPreviousPage();
                }
            }

            if (animatePages) {
                // Set pages before animation
                if (app.params.material && app.params.materialPageLoadDelay) {
                    setTimeout(function () {
                        app.router.animatePages(oldPage, newPage, 'to-left', view);
                    }, app.params.materialPageLoadDelay);
                }
                else {
                    app.router.animatePages(oldPage, newPage, 'to-left', view);
                }

                // Dynamic navbar animation
                if (dynamicNavbar) {
                    setTimeout(function () {
                        app.router.animateNavbars(oldNavbarInner, newNavbarInner, 'to-left', view);
                    }, 0);
                }
                newPage.animationEnd(function (e) {
                    afterAnimation();
                });
            }
            else {
                if (dynamicNavbar) newNavbarInner.find('.sliding, .sliding .back .icon').transform('');
                afterAnimation();
            }

        };

        app.router.load = function (view, options) {
            if (app.router.preroute(view, options)) {
                //如果使用自定义的路由则返回false
                return false;
            }
            options = options || {};
            var url = options.url;
            var content = options.content;  //默认link传递的参数里没有content这一个属性
            var pageName = options.pageName;
            if (pageName) {
                if (pageName.indexOf('?') > 0) {
                    //判断pageName里是否有传递参数，如果有则进行拆分，并把参数放到query里，pageName只保留具体的Name
                    options.query = $.parseUrlQuery(pageName);
                    options.pageName = pageName = pageName.split('?')[0];
                }
            }

            var template = options.template; //默认link传递的参数里没有template这一个属性
            if (view.params.reloadPages === true) options.reload = true;

            if (!view.allowPageChange) return false; //如果视图不允许页面变化则直接返回
            //如果跳转的url地址与当前视图地址一样，同时参数中reload为不允许重载，同时视图参数中也不允许在同一个页面在当前active加载则直接返回
            if (url && view.url === url && !options.reload && !view.params.allowDuplicateUrls) return false;

            view.allowPageChange = false;  //这里为什么要把这个变量给赋值成false呢？寓意何在

            if (app.xhr && view.xhr && view.xhr === app.xhr) {
                app.xhr.abort(); //取消Ajax请求
                app.xhr = false;
            }

            function proceed(content) {
                app.router.preprocess(view, content, url, function (content) {
                    options.content = content;
                    app.router._load(view, options);
                });
            }

            if (content || pageName) {
                proceed(content);
                return;
            }
            else if (template) {
                //app.router._load(view, options);
                return;
            }

            if (!options.url || options.url === '#') {
                view.allowPageChange = true;
                return;
            }
            app.get(options.url, view, options.ignoreCache, function (content, error) {
                if (error) {
                    view.allowPageChange = true;
                    return;
                }
                proceed(content);
            });


        };


        /*======================================================
         ************   Pages   ************
         ======================================================*/
// Page Callbacks API
        app.pageCallbacks = {};

        app.onPage = function (callbackName, pageName, callback) {
            if (pageName && pageName.split(' ').length > 1) {
                var pageNames = pageName.split(' ');
                var returnCallbacks = [];
                for (var i = 0; i < pageNames.length; i++) {
                    returnCallbacks.push(app.onPage(callbackName, pageNames[i], callback));
                }
                returnCallbacks.remove = function () {
                    for (var i = 0; i < returnCallbacks.length; i++) {
                        returnCallbacks[i].remove();
                    }
                };
                returnCallbacks.trigger = function () {
                    for (var i = 0; i < returnCallbacks.length; i++) {
                        returnCallbacks[i].trigger();
                    }
                };
                return returnCallbacks;
            }
            var callbacks = app.pageCallbacks[callbackName][pageName];
            if (!callbacks) {
                callbacks = app.pageCallbacks[callbackName][pageName] = [];
            }
            app.pageCallbacks[callbackName][pageName].push(callback);
            return {
                remove: function () {
                    var removeIndex;
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].toString() === callback.toString()) {
                            removeIndex = i;
                        }
                    }
                    if (typeof removeIndex !== 'undefined') callbacks.splice(removeIndex, 1);
                },
                trigger: callback
            };
        };

//Create callbacks methods dynamically
        function createPageCallback(callbackName) {
            var capitalized = callbackName.replace(/^./, function (match) {
                return match.toUpperCase();
            });
            app['onPage' + capitalized] = function (pageName, callback) {
                return app.onPage(callbackName, pageName, callback);
            };
        }

        var pageCallbacksNames = ('beforeInit init reinit beforeAnimation afterAnimation back afterBack beforeRemove').split(' ');
        for (var i = 0; i < pageCallbacksNames.length; i++) {
            app.pageCallbacks[pageCallbacksNames[i]] = {};
            createPageCallback(pageCallbacksNames[i]);
        }

        app.triggerPageCallbacks = function (callbackName, pageName, pageData) {
            var allPagesCallbacks = app.pageCallbacks[callbackName]['*'];
            if (allPagesCallbacks) {
                for (var j = 0; j < allPagesCallbacks.length; j++) {
                    allPagesCallbacks[j](pageData);
                }
            }
            var callbacks = app.pageCallbacks[callbackName][pageName];
            if (!callbacks || callbacks.length === 0) return;
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](pageData);
            }
        };

// On Page Init Callback
        app.pageInitCallback = function (view, params) {
            var pageContainer = params.pageContainer;
            if (pageContainer.f7PageInitialized && view && !view.params.domCache) return;

            var pageQuery = params.query;
            if (!pageQuery) {
                if (params.url && params.url.indexOf('?') > 0) {
                    pageQuery = $.parseUrlQuery(params.url || '');
                }
                else if (pageContainer.f7PageData && pageContainer.f7PageData.query) {
                    pageQuery = pageContainer.f7PageData.query;
                }
                else {
                    pageQuery = {};
                }
            }

            // Page Data
            var pageData = {
                container: pageContainer,
                url: params.url,
                query: pageQuery,
                name: $(pageContainer).attr('data-page'),
                view: view,
                from: params.position,
                context: params.context,
                navbarInnerContainer: params.navbarInnerContainer,
                fromPage: params.fromPage
            };
            if (params.fromPage && !params.fromPage.navbarInnerContainer && params.oldNavbarInnerContainer) {
                params.fromPage.navbarInnerContainer = params.oldNavbarInnerContainer;
            }

            if (pageContainer.f7PageInitialized && ((view && view.params.domCache) || (!view && $(pageContainer).parents('.popup, .popover, .login-screen, .modal, .actions-modal, .picker-modal').length > 0))) {
                // Reinit Page
                app.reinitPage(pageContainer);

                // Callbacks
                //app.pluginHook('pageReinit', pageData);
                if (app.params.onPageReinit) app.params.onPageReinit(app, pageData);
                app.triggerPageCallbacks('reinit', pageData.name, pageData);
                $(pageData.container).trigger('pageReinit', {page: pageData});
                return;
            }
            pageContainer.f7PageInitialized = true;

            // Store pagedata in page
            pageContainer.f7PageData = pageData;

            // Update View's activePage
            if (view && !params.preloadOnly && !params.reloadPrevious) {
                // Add data-page on view
                $(view.container).attr('data-page', pageData.name);
                // Update View active page data
                view.activePage = pageData;
            }

            // Before Init Callbacks
            app.pluginHook('pageBeforeInit', pageData);
            if (app.params.onPageBeforeInit) app.params.onPageBeforeInit(app, pageData);
            app.triggerPageCallbacks('beforeInit', pageData.name, pageData);
            $(pageData.container).trigger('pageBeforeInit', {page: pageData});

            // Init page
            app.initPage(pageContainer);

            // Init Callback
            app.pluginHook('pageInit', pageData);
            if (app.params.onPageInit) app.params.onPageInit(app, pageData);
            app.triggerPageCallbacks('init', pageData.name, pageData);
            $(pageData.container).trigger('pageInit', {page: pageData});
        };
        app.pageRemoveCallback = function (view, pageContainer, position) {
            var pageContext;
            if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;
            // Page Data
            var pageData = {
                container: pageContainer,
                name: $(pageContainer).attr('data-page'),
                view: view,
                url: pageContainer.f7PageData && pageContainer.f7PageData.url,
                query: pageContainer.f7PageData && pageContainer.f7PageData.query,
                navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
                from: position,
                context: pageContext
            };
            // Before Init Callback
            app.pluginHook('pageBeforeRemove', pageData);
            if (app.params.onPageBeforeRemove) app.params.onPageBeforeRemove(app, pageData);
            app.triggerPageCallbacks('beforeRemove', pageData.name, pageData);
            $(pageData.container).trigger('pageBeforeRemove', {page: pageData});
        };
        app.pageBackCallback = function (callback, view, params) {
            // Page Data
            var pageContainer = params.pageContainer;
            var pageContext;
            if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;

            var pageData = {
                container: pageContainer,
                name: $(pageContainer).attr('data-page'),
                url: pageContainer.f7PageData && pageContainer.f7PageData.url,
                query: pageContainer.f7PageData && pageContainer.f7PageData.query,
                view: view,
                from: params.position,
                context: pageContext,
                navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
                swipeBack: params.swipeBack
            };

            if (callback === 'after') {
                app.pluginHook('pageAfterBack', pageData);
                if (app.params.onPageAfterBack) app.params.onPageAfterBack(app, pageData);
                app.triggerPageCallbacks('afterBack', pageData.name, pageData);
                $(pageContainer).trigger('pageAfterBack', {page: pageData});

            }
            if (callback === 'before') {
                app.pluginHook('pageBack', pageData);
                if (app.params.onPageBack) app.params.onPageBack(app, pageData);
                app.triggerPageCallbacks('back', pageData.name, pageData);
                $(pageData.container).trigger('pageBack', {page: pageData});
            }
        };
        app.pageAnimCallback = function (callback, view, params) {
            var pageContainer = params.pageContainer;
            var pageContext;
            if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;

            var pageQuery = params.query;
            if (!pageQuery) {
                if (params.url && params.url.indexOf('?') > 0) {
                    pageQuery = $.parseUrlQuery(params.url || '');
                }
                else if (pageContainer.f7PageData && pageContainer.f7PageData.query) {
                    pageQuery = pageContainer.f7PageData.query;
                }
                else {
                    pageQuery = {};
                }
            }
            // Page Data
            var pageData = {
                container: pageContainer,
                url: params.url,
                query: pageQuery,
                name: $(pageContainer).attr('data-page'),
                view: view,
                from: params.position,
                context: pageContext,
                swipeBack: params.swipeBack,
                navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
                fromPage: params.fromPage
            };
            var oldPage = params.oldPage,
                newPage = params.newPage;

            // Update page date
            pageContainer.f7PageData = pageData;

            if (callback === 'after') {
                app.pluginHook('pageAfterAnimation', pageData);
                if (app.params.onPageAfterAnimation) app.params.onPageAfterAnimation(app, pageData);
                app.triggerPageCallbacks('afterAnimation', pageData.name, pageData);
                $(pageData.container).trigger('pageAfterAnimation', {page: pageData});

            }
            if (callback === 'before') {
                // Add data-page on view
                $(view.container).attr('data-page', pageData.name);

                // Update View's activePage
                if (view) view.activePage = pageData;

                // Hide/show navbar dynamically
                if (newPage.hasClass('no-navbar') && !oldPage.hasClass('no-navbar')) {
                    view.hideNavbar();
                }
                if (!newPage.hasClass('no-navbar') && (oldPage.hasClass('no-navbar') || oldPage.hasClass('no-navbar-by-scroll'))) {
                    view.showNavbar();
                }
                // Hide/show navbar toolbar
                if (newPage.hasClass('no-toolbar') && !oldPage.hasClass('no-toolbar')) {
                    view.hideToolbar();
                }
                if (!newPage.hasClass('no-toolbar') && (oldPage.hasClass('no-toolbar') || oldPage.hasClass('no-toolbar-by-scroll'))) {
                    view.showToolbar();
                }
                // Hide/show tabbar
                var tabBar;
                if (newPage.hasClass('no-tabbar') && !oldPage.hasClass('no-tabbar')) {
                    tabBar = $(view.container).find('.tabbar');
                    if (tabBar.length === 0) tabBar = $(view.container).parents('.' + app.params.viewsClass).find('.tabbar');
                    app.hideToolbar(tabBar);
                }
                if (!newPage.hasClass('no-tabbar') && (oldPage.hasClass('no-tabbar') || oldPage.hasClass('no-tabbar-by-scroll'))) {
                    tabBar = $(view.container).find('.tabbar');
                    if (tabBar.length === 0) tabBar = $(view.container).parents('.' + app.params.viewsClass).find('.tabbar');
                    app.showToolbar(tabBar);
                }

                oldPage.removeClass('no-navbar-by-scroll no-toolbar-by-scroll');
                // Callbacks
                app.pluginHook('pageBeforeAnimation', pageData);
                if (app.params.onPageBeforeAnimation) app.params.onPageBeforeAnimation(app, pageData);
                app.triggerPageCallbacks('beforeAnimation', pageData.name, pageData);
                $(pageData.container).trigger('pageBeforeAnimation', {page: pageData});
            }
        };

// Init Page Events and Manipulations
        app.initPage = function (pageContainer) {
            pageContainer = $(pageContainer);
            if (pageContainer.length === 0) return;
            // Size navbars on page load
            //if (app.sizeNavbars) app.sizeNavbars(pageContainer.parents('.' + app.params.viewClass)[0]);
            //// Init messages
            //if (app.initPageMessages) app.initPageMessages(pageContainer);
            //// Init forms storage
            //if (app.initFormsStorage) app.initFormsStorage(pageContainer);
            //// Init smart select
            //if (app.initSmartSelects) app.initSmartSelects(pageContainer);
            //// Init slider
            //if (app.initPageSwiper) app.initPageSwiper(pageContainer);
            //// Init pull to refres
            //if (app.initPullToRefresh) app.initPullToRefresh(pageContainer);
            //// Init infinite scroll
            //if (app.initInfiniteScroll) app.initInfiniteScroll(pageContainer);
            //// Init searchbar
            //if (app.initSearchbar) app.initSearchbar(pageContainer);
            //// Init message bar
            //if (app.initPageMessagebar) app.initPageMessagebar(pageContainer);
            //// Init scroll toolbars
            //if (app.initScrollToolbars) app.initScrollToolbars(pageContainer);
            //// Init lazy images
            //if (app.initImagesLazyLoad) app.initImagesLazyLoad(pageContainer);
            //// Init resizeable textareas
            //if (app.initPageResizableTextareas) app.initPageResizableTextareas(pageContainer);
            //// Init Material Preloader
            //if (app.params.material && app.initPageMaterialPreloader) app.initPageMaterialPreloader(pageContainer);
            //// Init Material Inputs
            //if (app.params.material && app.initPageMaterialInputs) app.initPageMaterialInputs(pageContainer);
            //// Init Material Tabbar
            //if (app.params.material && app.initPageMaterialTabbar) app.initPageMaterialTabbar(pageContainer);
        };
        app.reinitPage = function (pageContainer) {
            pageContainer = $(pageContainer);
            if (pageContainer.length === 0) return;
            // Size navbars on page reinit
            //if (app.sizeNavbars) app.sizeNavbars(pageContainer.parents('.' + app.params.viewClass)[0]);
            // Reinit slider
            //if (app.reinitPageSwiper) app.reinitPageSwiper(pageContainer);
            // Reinit lazy load
            //if (app.reinitLazyLoad) app.reinitLazyLoad(pageContainer);
        };
        app.initPageWithCallback = function (pageContainer) {
            pageContainer = $(pageContainer);
            var viewContainer = pageContainer.parents('.' + app.params.viewClass);
            if (viewContainer.length === 0) return;
            var view = viewContainer[0].f7View || undefined;
            var url = view && view.url ? view.url : undefined;
            if (viewContainer && pageContainer.attr('data-page')) {
                viewContainer.attr('data-page', pageContainer.attr('data-page'));
            }
            app.pageInitCallback(view, {pageContainer: pageContainer[0], url: url, position: 'center'});
        };

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
                if (validUrl || clicked.hasClass('back') || template) {
                    var view;
                    if (clickedData.view) {
                        view = $(clickedData.view)[0].f7View;
                    } else {
                        view = clicked.parents('.' + app.params.viewClass)[0] && clicked.parents('.' + app.params.viewClass)[0].f7View;
                    }
                    if (!view) {
                        if (app.mainView) view = app.mainView;
                    }
                    if (!view) return;

                    var pageName;
                    if (!template) {
                        if (url.indexOf('#') === 0 && url !== "#") {
                            if (view.params.domCache) {
                                pageName = url.split('#')[1];
                                url = undefined;
                            } else return;
                        }
                        if (url === '#' && !clicked.hasClass('back')) return;
                    } else {
                        url = undefined;
                    }
                }

                var animatePages;
                if (typeof clickedData.animatePages !== 'undefined') {
                    animatePages = clickedData.animatePages;
                } else {
                    if (clicked.hasClass('with-animation')) animatePages = true;
                    if (clicked.hasClass('no-animation')) animatePages = false;
                }

                var options = {
                    animatePages: animatePages,
                    ignoreCache: clickedData.ignoreCache,
                    force: clickedData.force,
                    reload: clickedData.reload,
                    reloadPrevious: clickedData.reloadPrevious,
                    pageName: pageName,
                    pushState: clickedData.pushState,
                    url: url,
                };


                if (clicked.hasClass('back')) view.router.back(options);
                else view.router.load(options);
            }

            $(document).on('click', 'a', handleClicks);

        };


        /*===============================
         **********XHR*******************
         ===============================*/
        app.cache = [];
        app.removeFromCache = function (url) {
            var index = false;
            for (var i = 0; i < app.cache.length; i++) {
                if (app.cache[i].url === url)index = i;
            }
            //splice从数组中删除或者添加项目，第一个参数index是要删除和添加的位置，第二个参数是要删除的数量，0为不删除，第三个参数是要添加的项目
            if (index != false) app.cache.splice(index, 1);
        };
        app.xhr = false;
        app.get = function (url, view, ignoreCache, callback) {
            var _url = url;
            if (app.params.cacheIgnoreGetParameters && url.indexOf('?') >= 0) {
                _url = url.split('?')[0];
            }
            if (app.params.cache && !ignoreCache && url.indexOf('nocache') < 0 && app.params.cacheIgnore.indexOf(_url) < 0) {
                for (var i = 0; i < app.cache.length; i++) {
                    if (app.cache[i].url === url) {
                        //判断缓存是否已经超时
                        if ((new Date()).getTime() - app.cache[i].time < app.params.cacheDuration) {
                            console.log('缓存没有超时，从缓存中获取页面内容');
                            callback(app.cache[i].content);
                            return false;
                        }
                    }
                }
            }

            //下面调用Ajax进行数据获取
            console.log("app.get==" + url);
            app.xhr = $.ajax({
                url: url,
                method: 'GET',
                beforeSend: app.params.onAjaxStart,
                complete: function (xhr) {
                    console.log("complete=" + xhr.status);
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                        if (app.params.cache && !ignoreCache) {
                            app.removeFromCache(_url);
                            app.cache.push({
                                url: _url,
                                time: (new Date()).getTime(),
                                content: xhr.responseText
                            });
                        }
                        callback(xhr.responseText, false);
                    }
                    else {
                        callback(xhr.responseText, true);
                    }
                    if (app.params.onAjaxComplete) app.params.onAjaxComplete(xhr);
                },
                error: function (xhr) {
                    callback(xhr.responseText, true);
                    if (app.params.onAjaxError) app.params.onAjaxError(xhr);
                }
            });

            if (view) view.xhr = app.xhr;

            return app.xhr;

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
        // Classes and attriutes
        addClass: function (className) {
            if (typeof className === 'undefined') {
                return this;
            }
            var classes = className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
                }
            }
            return this;
        },
        removeClass: function (className) {
            var classes = className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
                }
            }
            return this;
        },
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
        children: function (selector) {
            var children = [];
            for (var i = 0; i < this.length; i++) {
                var childNodes = this[i].childNodes;

                for (var j = 0; j < childNodes.length; j++) {
                    if (!selector) {
                        if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                    }
                    else {
                        if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                    }
                }
            }
            return new Dom7($.unique(children));
        },
        remove: function () {
            for (var i = 0; i < this.length; i++) {
                if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        /**
         * 按照index获取Dom7中的新的Dom7对象
         * @param index
         * @returns {Dom7}
         */
        eq: function (index) {
            if (typeof index === 'undefined') return this;
            var length = this.length;
            var returnIndex;
            if (index > length - 1) {
                return new Dom7([]);
            }
            if (index < 0) {
                returnIndex = length + index;
                if (returnIndex < 0) return new Dom7([]);
                else return new Dom7([this[returnIndex]]);
            }
            return new Dom7([this[index]]);
        },
        /**
         * 通过CSS选择器寻找到元素中包含的所有匹配的元素并返回Dom7对象
         * @param selector
         * @returns {Dom7}
         */
        find: function (selector) {
            var foundElement = [];
            for (var i = 0; i < this.length; i++) {
                var found = this[i].querySelectorAll(selector);
                for (var j = 0; j < found.length; j++) {
                    foundElement.push(found[j]);
                }
            }
            return new Dom7(foundElement);
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
        insertBefore: function (selector) {
            var before = $(selector);
            for (var i = 0; i < this.length; i++) {
                if (before.length === 1) {
                    before[0].parentNode.insertBefore(this[i], before[0]);
                }
                else if (before.length > 1) {
                    for (var j = 0; j < before.length; j++) {
                        before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                    }
                }
            }
        },
        insertAfter: function (selector) {
            var after = $(selector);
            for (var i = 0; i < this.length; i++) {
                if (after.length === 1) {
                    after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                }
                else if (after.length > 1) {
                    for (var j = 0; j < after.length; j++) {
                        after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                    }
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
        prev: function (selector) {
            if (this.length > 0) {
                if (selector) {
                    if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                    else return new Dom7([]);
                }
                else {
                    if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                    else return new Dom7([]);
                }
            }
            else return new Dom7([]);
        },
        prevAll: function (selector) {
            var prevEls = [];
            var el = this[0];
            if (!el) return new Dom7([]);
            while (el.previousElementSibling) {
                var prev = el.previousElementSibling;
                if (selector) {
                    if ($(prev).is(selector)) prevEls.push(prev);
                }
                else prevEls.push(prev);
                el = prev;
            }
            return new Dom7(prevEls);
        },
        /**
         * 触发选中元素上的事件，指定所有的事件回调函数
         * @param eventName
         * @param eventData
         * @returns {Dom7}
         */
        trigger: function (eventName, eventData) {
            for (var i = 0; i < this.length; i++) {
                var evt;
                try {
                    evt = new CustomEvent(eventName, {detail: eventData, bubbles: true, cancelable: true});
                }
                catch (e) {
                    evt = document.createEvent('Event');
                    evt.initEvent(eventName, true, true);
                    evt.detail = eventData;
                }
                this[i].dispatchEvent(evt);
            }
            return this;
        },
    };


    /**------------------------
     * $的自身方法
     -------------------------*/
    var globalAjaxOptions = {};
    var _jsonpRequests = 0;
    /**
     * 把参数中的内容放到globalAjaxOptions全局变量中
     * @param options
     */
    $.ajaxSetup = function (options) {
        if (options.type) options.method = options.type;
        $.each(options, function (optionName, optionValue) {
            globalAjaxOptions[optionName] = optionValue;
        });
    };
    $.ajax = function (options) {
        var defaults = {
            method: 'GET',
            data: false,
            async: true,   //异步加载
            cache: true,
            user: '',
            password: '',
            headers: {},
            xhrFields: {},
            statusCode: {},
            processData: true,
            dataType: 'text',
            contentType: 'application/x-www-form-urlencoded',
            timeout: 0,
        };
        var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];
        if (options.type) options.method = options.type;

        $.each(globalAjaxOptions, function (optionName, optionValue) {
            if (callbacks.indexOf(optionName) < 0) defaults[optionName] = optionValue;
        });

        // Function to run XHR callbacks and events
        function fireAjaxCallback(eventName, eventData, callbackName) {
            var a = arguments;
            if (eventName) $(document).trigger(eventName, eventData);
            if (callbackName) {
                // Global callback
                if (callbackName in globalAjaxOptions) globalAjaxOptions[callbackName](a[3], a[4], a[5], a[6]);
                // Options callback
                if (options[callbackName]) options[callbackName](a[3], a[4], a[5], a[6]);
            }
        }

        //把默认参数放到options对象中
        $.each(defaults, function (optionName, optionValue) {
            if (!(optionName in options)) options[optionName] = optionValue;
        });
        //如果没有url则默认赋值
        if (!options.url) {
            options.url = window.location.toString();
        }

        var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';
        var _method = options.method.toUpperCase();
        //修改数据地址
        if ((_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') && options.data) {
            var stringData;
            if (typeof options.data === 'string') {
                // Should be key=value string
                if (options.data.indexOf('?') > 0)stringData = options.data.split('?')[1];
                else stringData = options.data;
            } else {
                // Should be key=value object
                stringData = $.serializeObject(options.data);
            }
            if (stringData.length) {
                options.url += paramsPrefix + stringData;
                if (paramsPrefix === '?') paramsPrefix = '&';
            }
        }

        //JSONP
        if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {
            var callbackName = 'f7jsonp_' + Date.now() + (_jsonpRequests++);
            var abortTimeout;
            var callbackSplit = options.url.split('callback=');
            var requestUrl = callbackSplit[0] + 'callback=' + callbackName;
            if (callbackSplit[1].indexOf('&') >= 0) {
                var addVars = callbackSplit[1].split('&').filter(function (el) {
                    return el.indexOf('=') > 0;
                }).join('&');
                if (addVars.length > 0) requestUrl += '&' + addVars;
            }

            // Create script
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onerror = function () {
                clearTimeout(abortTimeout);
                fireAjaxCallback(undefined, undefined, 'error', null, 'scripterror');
            };
            script.src = requestUrl;

            // Handler
            window[callbackName] = function (data) {
                clearTimeout(abortTimeout);
                fireAjaxCallback(undefined, undefined, 'success', data);
                script.parentNode.removeChild(script);
                script = null;
                delete window[callbackName];
            };
            document.querySelector('head').appendChild(script);

            if (options.timeout > 0) {
                abortTimeout = setTimeout(function () {
                    script.parentNode.removeChild(script);
                    script = null;
                    fireAjaxCallback(undefined, undefined, 'error', null, 'timeout');
                }, options.timeout);
            }
            return;
        }
        // Cache for GET/HEAD requests
        if (_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') {
            if (options.cache === false) {
                options.url += (paramsPrefix + '_nocache=' + Date.now());
            }
        }


        // Create XHR
        var xhr = new XMLHttpRequest();

        // Save Request URL
        xhr.requestUrl = options.url;
        xhr.requestParameters = options;

        // Open XHR
        //3.设置连接信息
        //初始化HTTP请求参数，但是并不发送请求。
        //第一个参数连接方式，第二是url地址,第三个true是异步连接，默认是异步
        xhr.open(_method, options.url, options.async, options.user, options.password);

        // 如果是POST则需要自己创建http的请求头内容
        var postData = null;

        if ((_method === 'POST' || _method === 'PUT' || _method === 'PATCH') && options.data) {
            if (options.processData) {
                var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
                // Post Data
                if (postDataInstances.indexOf(options.data.constructor) >= 0) {
                    postData = options.data;
                }
                else {
                    // POST Headers
                    var boundary = '---------------------------' + Date.now().toString(16);

                    if (options.contentType === 'multipart\/form-data') {
                        xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
                    }
                    else {
                        xhr.setRequestHeader('Content-Type', options.contentType);
                    }
                    postData = '';
                    var _data = $.serializeObject(options.data);
                    if (options.contentType === 'multipart\/form-data') {
                        boundary = '---------------------------' + Date.now().toString(16);
                        _data = _data.split('&');
                        var _newData = [];
                        for (var i = 0; i < _data.length; i++) {
                            _newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
                        }
                        postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
                    }
                    else {
                        postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
                    }
                }
            }
            else {
                postData = options.data;
            }

        }

        //post需要自己设置http的请求头
        //xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        if (options.headers) {
            $.each(options.headers, function (headerName, headerCallback) {
                xhr.setRequestHeader(headerName, headerCallback);
            });
        }

        // Check for crossDomain
        if (typeof options.crossDomain === 'undefined') {
            options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
        }

        if (!options.crossDomain) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        if (options.xhrFields) {
            $.each(options.xhrFields, function (fieldName, fieldValue) {
                xhr[fieldName] = fieldValue;
            });
        }

        var xhrTimeout;
        // Handle XHR
        xhr.onload = function (e) {
            if (xhrTimeout) clearTimeout(xhrTimeout);
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                var responseData;
                if (options.dataType === 'json') {
                    try {
                        responseData = JSON.parse(xhr.responseText);
                        fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                    }
                    catch (err) {
                        fireAjaxCallback('ajaxError', {xhr: xhr, parseerror: true}, 'error', xhr, 'parseerror');
                    }
                }
                else {
                    responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
                    fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                }
            }
            else {
                fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
            }
            if (options.statusCode) {
                if (globalAjaxOptions.statusCode && globalAjaxOptions.statusCode[xhr.status]) globalAjaxOptions.statusCode[xhr.status](xhr);
                if (options.statusCode[xhr.status]) options.statusCode[xhr.status](xhr);
            }
            fireAjaxCallback('ajaxComplete', {xhr: xhr}, 'complete', xhr, xhr.status);
        };

        xhr.onerror = function (e) {
            if (xhrTimeout) clearTimeout(xhrTimeout);
            fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
        };

        // Ajax start callback
        fireAjaxCallback('ajaxStart', {xhr: xhr}, 'start', xhr);
        fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


        // Send XHR
        xhr.send(postData);
        // Timeout
        if (options.timeout > 0) {
            xhr.onabort = function () {
                if (xhrTimeout) clearTimeout(xhrTimeout);
            };
            xhrTimeout = setTimeout(function () {
                xhr.abort();
                fireAjaxCallback('ajaxError', {xhr: xhr, timeout: true}, 'error', xhr, 'timeout');
                fireAjaxCallback('ajaxComplete', {xhr: xhr, timeout: true}, 'complete', xhr, 'timeout');
            }, options.timeout);
        }

        // Return XHR object
        return xhr;

    };
    /**
     * 循环数组内容，并通过callback回调函数分别对数组内容进行处理
     * @param obj
     * @param callback
     */
    $.each = function (obj, callback) {
        //如果obj不是对象则返回，如果callback没有定义则返回
        if (typeof obj !== 'object') return;
        if (!callback) return;
        var i, prop;
        if ($.isArray(obj) || obj instanceof  Dom7) {
            //如果obj是数组或者Dom7对象则执行下列代码
            for (i = 0; i < obj.length; i++) {
                callback(i, obj[i]);
            }
        } else {
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) { //hasOwnProperty：是用来判断一个对象是否有你给出名称的属性或对象
                    callback(prop, obj[prop]);
                }
            }
        }
    };
    /**
     * 判断参数是否数组对象
     * @param arr
     * @returns {boolean}
     */
    $.isArray = function (arr) {
        if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
        else return false;
    };
    /**
     * 处理具有参数的url字符串，拆分参数并返回query对象
     * @param url
     * @returns {{}}
     */
    $.parseUrlQuery = function (url) {
        var query = {}, i, params, param;
        if (url.indexOf('?') >= 0) url = url.split('?')[1];
        else return query;
        params = url.split('&');
        for (i = 0; i < params.length; i++) {
            param = params[i].split('=');
            query[param[0]] = param[1];
        }
        return query;
    };
    $.serializeObject = $.param = function (obj, parents) {
        if (typeof obj === 'string') return obj;
        var resultArray = [];
        var separator = '&';
        parents = parents || [];
        var newParents;

        function var_name(name) {
            //encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
            if (parents.length > 0) {
                var _parents = '';
                for (var j = 0; j < parents.length; j++) {
                    if (j === 0) _parents += parents[j];
                    else _parents += '[' + encodeURIComponent(parents[j]) + ']';
                }
                return _parents + '[' + encodeURIComponent(name) + ']';
            }
            else {
                return encodeURIComponent(name);
            }
        }

        function var_value(value) {
            return encodeURIComponent(value);
        }

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var toPush;
                if ($.isArray(obj[prop])) {
                    toPush = [];
                    for (var i = 0; i < obj[prop].length; i++) {
                        if (!$.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                            newParents = parents.slice(); //把parents的所有元素都返回
                            newParents.push(prop);
                            newParents.push(i + '');
                            toPush.push($.serializeObject(obj[prop][i], newParents));
                        } else {
                            toPush.push(var_name(prop) + '[' + i + ']=' + var_value(obj[prop][i]));
                        }
                    }
                    if (toPush.length > 0) resultArray.push(toPush.join(separator));
                }
                else if (typeof obj[prop] === 'object') {
                    // Object, convert to named array
                    newParents = parents.slice();
                    newParents.push(prop);
                    toPush = $.serializeObject(obj[prop], newParents);
                    if (toPush !== '') resultArray.push(toPush);
                }
                else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                    // Should be string or plain value
                    resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
                }
            }
        }
        return resultArray.join(separator);
    };
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

