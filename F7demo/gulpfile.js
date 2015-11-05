(function(){
    'use strict'; //javascript ���ϸ�ģʽ

    var gulp = require('gulp');  //����gulpģ��
    //�����������gulp���
    var connect = require('gulp-connect');//���ڴ�������web�����������
    var less = require('gulp-less'); //��less�ļ������css�����
    var rename = require('gulp-rename');//���Խ��������������
    //var path = require('path');  //���������Ƿ����ʹ��
    var uglify = require('gulp-uglify'); //����ѹ��js�����
    var jshint = require('gulp-jshint'); //js����У������
    var concat = require('gulp-concat'); //�ϲ�js�ļ������
    var open = require('gulp-open');
    //var minifyCSS = require('gulp-minify-css'); //ѹ��css�ļ������
    //���屾��Ŀ��Ҫ�õ�����·��
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
    //���屾��Ŀ�Ļ�����������
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
    ������Ŀ�ļ��ı��봦��
     */
    //����һ��hint�������js��У�飬����Ƿ��б���򾯸�
    gulp.task('hint',function(cb){
        gulp.src(f7.jsRoot)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .on('end',function(){
                cb();
            });
    });

    //����һ��scripts���񣬽���js��У��ͺϲ�
    //gulp.dest()�ܱ� pipe ���������ҽ���д�ļ����������������emits���������ݣ�
    // �������Խ��� pipe ������ļ��С����ĳ�ļ��в����ڣ������Զ�������
    gulp.task('scripts',function(cb){
        // �Ӵ����ж�ȡ���ļ�
        gulp.src(f7.jsRoot)
            .pipe(concat(f7.filename+'.js')) // �����п��ļ�ƴ�ӵ�һ��
            .pipe(gulp.dest(paths.build.scripts))//���ϲ�����ļ������pahts.build.scriptsĿ¼��
            .pipe(rename(f7.filename+'.min.js')) //���ļ�����������
            .pipe(uglify()) //�������ѹ������
            .pipe(gulp.dest(paths.build.scripts))
            .pipe(connect.reload())  //����reload����������¼����ļ�
            .on('end',function(){
                cb();
            });
    });

    //����styles-ios���񣬽���less�ļ��ı���ϲ�����
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

    //����styles-material���񣬽���less�ļ��ı���ϲ�����
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

    //����һ��html���񣬴���htmlҳ���Զ��������������
    gulp.task('html',function(cb){
        gulp.src(paths.htmls)
            .pipe(connect.reload())
            .on('end',function(){
                cb();
            });
    });

    //����gulp�ļ������񣬶���Ŀ�е��ļ����м��������ֱ䶯���Զ�������������ļ�����
    gulp.task('watch',function(){
        gulp.watch(paths.source.scripts,['scripts']); //���scriptsĿ¼�µ��ļ������仯������scripts������д���
        gulp.watch(paths.source.styles.ios,['styles-ios']); //���ios��less�ļ��仯������styles-ios����
        gulp.watch(paths.source.styles.material,['styles-material']); //���material��less�ļ��仯������styles-material����

        gulp.watch(paths.htmls,['html']); //���htmlҳ�淢���仯�����html��������ؼ���
    });

    //ʹ��connect����һ��web������
    gulp.task('connect', function () {
        return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
        });
    });
    //�Զ���web��ҳ��ַ
    gulp.task('open', function () {
        return gulp.src('./index.html')
            .pipe(open({ uri: 'http://localhost:3000/index.html'}));
    });

    gulp.task('server', [ 'watch', 'connect' ]);

    gulp.task('default', [ 'server' ]);

    //gulp.task('test', [ 'build' ]);

})();








// ���� gulp
//var gulp = require('gulp');

// �������
//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');

// ���ű�
// ��� js/ Ŀ¼�µ�js�ļ���û�б���򾯸�
//gulp.task('lint', function() {
//    gulp.src('./js/*.js')
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});
//
//// ����Sass
//// ���� scss/ Ŀ¼�µ�scss�ļ������ѱ�����ɵ�css�ļ����浽 /css Ŀ¼��
//gulp.task('sass', function() {
//    gulp.src('./scss/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('./css'));
//});
//
//// �ϲ���ѹ���ļ�
//// �ϲ� js/ Ŀ¼�µ����е�js�ļ�������� dist/ Ŀ¼��Ȼ��gulp����������ѹ���ϲ����ļ���Ҳ����� dist/ Ŀ¼
//gulp.task('scripts', function() {
//    gulp.src('./js/*.js')
//        .pipe(concat('all.js'))
//        .pipe(gulp.dest('./dist'))
//        .pipe(rename('all.min.js'))
//        .pipe(uglify())
//        .pipe(gulp.dest('./dist'));
//});
//
//// Ĭ������
//// ���Ǵ�����һ���������������default����ʹ�� .run() ���������������������涨�������
//// ʹ�� .watch() ����ȥ����ָ��Ŀ¼���ļ��仯�������ļ��仯ʱ�������лص��������������
//gulp.task('default', function(){
//    gulp.run('lint', 'sass', 'scripts');
//
//    // �����ļ��仯
//    gulp.watch('./js/*.js', function(){
//        gulp.run('lint', 'sass', 'scripts');
//    });
//});