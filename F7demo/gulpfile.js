// ���� gulp
var gulp = require('gulp'); 

// �������
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// ���ű�
// ��� js/ Ŀ¼�µ�js�ļ���û�б���򾯸�
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// ����Sass
// ���� scss/ Ŀ¼�µ�scss�ļ������ѱ�����ɵ�css�ļ����浽 /css Ŀ¼��
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// �ϲ���ѹ���ļ�
// �ϲ� js/ Ŀ¼�µ����е�js�ļ�������� dist/ Ŀ¼��Ȼ��gulp����������ѹ���ϲ����ļ���Ҳ����� dist/ Ŀ¼
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// Ĭ������
// ���Ǵ�����һ���������������default����ʹ�� .run() ���������������������涨�������
// ʹ�� .watch() ����ȥ����ָ��Ŀ¼���ļ��仯�������ļ��仯ʱ�������лص��������������
gulp.task('default', function(){
    gulp.run('lint', 'sass', 'scripts');

    // �����ļ��仯
    gulp.watch('./js/*.js', function(){
        gulp.run('lint', 'sass', 'scripts');
    });
});