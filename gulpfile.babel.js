import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import ngAnnotate from 'gulp-ng-annotate';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import minifyHtml from 'gulp-minify-html';
import ngTemplate from 'gulp-ng-template';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import usemin from 'gulp-usemin';

// Packaging JS dependence
gulp.task('angular', () => {
    gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-touch/angular-touch.min.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist/js'));
});

// Packaging CSS dependence
gulp.task('css', () => {
    gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css'])
        .pipe(gulp.dest('dist/css'));
});

// Packaging fonts
gulp.task('font', () => {
    gulp.src([
        'node_modules/bootstrap/dist/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'));
});

// Packaging templates
gulp.task('template', () => {
    gulp.src([
        'app/controller/**/*.html',
        'app/component/**/*.html'])
        .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplate({
            moduleName: 'app',
            filePath: 'templates.js'
        }))
        .pipe(gulp.dest('dist/js'));
});

// Packaging own JS code
gulp.task('js', () => {
    gulp.src([
        'app/*.js',
        'app/**/*.js',
        'app/**/**/*.js'])
    .pipe(plumber())
    .pipe(ngAnnotate())
    .pipe(concat('rss.js'))
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));
});

// Packaging own CSS code
gulp.task('sass', () => {
    gulp.src([
        'app/*.scss',
        'app/**/*.scss',
        'app/**/**/*.scss'])
        .pipe(plumber())
        .pipe(concat('rss.css'))
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

// Auto watch and build
gulp.watch(['app/*.js', 'app/**/*.js', 'app/**/**/*.js'], ['js']);
gulp.watch(['app/*.scss', 'app/**/*.scss', 'app/**/**/*.scss'], ['sass']);
gulp.watch(['app/controller/**/*.html', 'app/component/**/*.html'], ['template']);

// Task
gulp.task('default', ['angular', 'css', 'font', 'js', 'sass', 'template']);
