(function(){
    'use strict'; //javascript 的严格模式

    var gulp = require('gulp');  //引入gulp模块
    //下面引入各种gulp组件
    var connect = require('gulp-connect');//用于创建本地web服务器的组件
    var less = require('gulp-less'); //将less文件编译成css的组件
    var rename = require('gulp-rename');//可以进行重命名的组件
    //var path = require('path');  //不清楚这个是否可以使用
    var uglify = require('gulp-uglify'); //用于压缩js的组件
    var jshint = require('gulp-jshint'); //js代码校验的组件
    var concat = require('gulp-concat'); //合并js文件的组件
    var open = require('gulp-open');
    //var minifyCSS = require('gulp-minify-css'); //压缩css文件的组件
    //定义本项目将要用的所有路径
    var paths = {
        root: './',
        htmls: './**/*.html',
        build: {
            root: 'build/',
            styles: 'build/css/',
            scripts: 'build/js'
        },
        source: {
            root: 'src/',
            styles: {
                ios: ['src/less/ios/hy-f7.ios.less'],
                material: ['src/less/material/hy-f7.material.less']
            },
            scripts: 'src/js/*.js'
        }
    };
    //定义本项目的基本名称属性
    var f7 = {
        filename: 'hy-f7',
        jsRoot: 'src/js/*.js',
        date:{
            year: new Date().getFullYear(),
            month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
            day: new Date().getDate()
        }
    };


    /*
    进行项目文件的编译处理
     */
    //创建一个hint任务进行js的校验，检查是否有报错或警告
    gulp.task('hint',function(cb){
        gulp.src(f7.jsRoot)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .on('end',function(){
                cb();
            });
    });

    //创建一个scripts任务，进行js的校验和合并
    //gulp.dest()能被 pipe 进来，并且将会写文件。并且重新输出（emits）所有数据，
    // 因此你可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它
    gulp.task('scripts',function(cb){
        // 从磁盘中读取库文件
        gulp.src(f7.jsRoot)
            .pipe(concat(f7.filename+'.js')) // 将所有库文件拼接到一起
            .pipe(gulp.dest(paths.build.scripts))//将合并后的文件输出到pahts.build.scripts目录中
            .pipe(rename(f7.filename+'.min.js')) //对文件进行重命名
            .pipe(uglify()) //对其进行压缩处理
            .pipe(gulp.dest(paths.build.scripts))
            .pipe(connect.reload())  //调用reload让浏览器重新加载文件
            .on('end',function(){
                cb();
            });
    });

    //创建styles-ios任务，进行less文件的编译合并处理
    gulp.task('styles-ios',function(cb){
        var inx = 0;
        paths.source.styles.ios.forEach(function(lessFileName,b){
            gulp.src(lessFileName)
                .pipe(less())
                .pipe(gulp.dest(paths.build.styles))
                .pipe(connect.reload())
                .on('end',function(){
                    inx ++;
                    if(inx === paths.source.styles.ios.length) cb();
                });
        });
    });

    //创建styles-material任务，进行less文件的编译合并处理
    gulp.task('styles-material',function(cb){
        var inx = 0;
        paths.source.styles.material.forEach(function(lessFileName,b){
            gulp.src(lessFileName)
                .pipe(less())
                .pipe(gulp.dest(paths.build.styles))
                .pipe(connect.reload())
                .on('end',function(){
                    inx ++;
                    if(inx === paths.source.styles.material.length) cb();
                });
        });
    });

    //创建一个html任务，处理html页面自动加载浏览器功能
    gulp.task('html',function(cb){
        gulp.src(paths.htmls)
            .pipe(connect.reload())
            .on('end',function(){
                cb();
            });
    });

    //创建gulp的监听任务，对项目中的文件进行监听，发现变动则自动调用任务进行文件处理
    gulp.task('watch',function(){
        gulp.watch(paths.source.scripts,['scripts']); //如果scripts目录下的文件发生变化则启动scripts任务进行处理
        gulp.watch(paths.source.styles.ios,['styles-ios']); //如果ios的less文件变化则启动styles-ios任务
        gulp.watch(paths.source.styles.material,['styles-material']); //如果material的less文件变化则启动styles-material任务

        gulp.watch(paths.htmls,['html']); //如果html页面发生变化则调用html任务进行重加载
    });

    //使用connect启动一个web服务器
    gulp.task('connect', function () {
        return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
        });
    });
    //自动打开web首页地址
    gulp.task('open', function () {
        return gulp.src('./index.html')
            .pipe(open({ uri: 'http://localhost:3000/index.html'}));
    });

    gulp.task('server', [ 'watch', 'connect' ]);

    gulp.task('default', [ 'server' ]);

    //gulp.task('test', [ 'build' ]);

})();








// 引入 gulp
//var gulp = require('gulp');

// 引入组件
//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');

// 检查脚本
// 检查 js/ 目录下得js文件有没有报错或警告
//gulp.task('lint', function() {
//    gulp.src('./js/*.js')
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});
//
//// 编译Sass
//// 编译 scss/ 目录下的scss文件，并把编译完成的css文件保存到 /css 目录中
//gulp.task('sass', function() {
//    gulp.src('./scss/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('./css'));
//});
//
//// 合并，压缩文件
//// 合并 js/ 目录下得所有得js文件并输出到 dist/ 目录，然后gulp会重命名、压缩合并的文件，也输出到 dist/ 目录
//gulp.task('scripts', function() {
//    gulp.src('./js/*.js')
//        .pipe(concat('all.js'))
//        .pipe(gulp.dest('./dist'))
//        .pipe(rename('all.min.js'))
//        .pipe(uglify())
//        .pipe(gulp.dest('./dist'));
//});
//
//// 默认任务
//// 我们创建了一个基于其他任务的default任务。使用 .run() 方法关联和运行我们上面定义的任务，
//// 使用 .watch() 方法去监听指定目录的文件变化，当有文件变化时，会运行回调定义的其他任务
//gulp.task('default', function(){
//    gulp.run('lint', 'sass', 'scripts');
//
//    // 监听文件变化
//    gulp.watch('./js/*.js', function(){
//        gulp.run('lint', 'sass', 'scripts');
//    });
//});