const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const ngAnnotate = require('gulp-ng-annotate')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const minifyHtml = require('gulp-minify-html')
const ngTemplate = require('gulp-ng-template')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const htmlify = require('gulp-angular-htmlify')

// Packaging JS dependence
gulp.task('angular', () => {
  gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/angular-touch/angular-touch.min.js',
    'node_modules/angular-sanitize/angular-sanitize.min.js',
    'node_modules/angular-resource/angular-resource.js',
    'node_modules/angular-cookies/angular-cookies.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/angular-base64/angular-base64.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/d3/d3.min.js',
    'node_modules/nvd3/build/nv.d3.min.js',
    'node_modules/angular-nvd3/dist/angular-nvd3.js',
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
  // Backend & app
  gulp.src([
    'node_modules/underscore/underscore-min.js',
  ])
  .pipe(gulp.dest('public/js'))
})

// Packaging CSS dependence
gulp.task('css', () => {
  gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/nvd3/build/nv.d3.css',
  ])
  .pipe(concat('common.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest('public/css'))
  // Backend
  gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'))
  gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'))
})

// Packaging fonts
gulp.task('font', () => {
  gulp.src([
    'node_modules/bootstrap/dist/fonts/*.*',
  ])
  .pipe(gulp.dest('public/fonts'))
})

// Packaging templates
gulp.task('template', () => {
  gulp.src([
    'app/controller/**/*.html',
    'app/component/**/*.html',
  ])
  .pipe(htmlify())
  .pipe(minifyHtml({
    empty:  true,
    quotes: true,
  }))
  .pipe(ngTemplate({
    moduleName: 'app',
    filePath:   'templates.js',
  }))
  .pipe(uglify())
  .pipe(gulp.dest('public/js'))
})

// Packaging own JS code
gulp.task('js', () => {
  gulp.src([
    'app/*.js',
    'app/**/*.js',
    'app/**/**/*.js',
    'utils/index.js',
  ])
  .pipe(plumber())
  .pipe(ngAnnotate())
  .pipe(babel())
  .pipe(concat('rss.js'))
  .pipe(gulp.dest('public/js'))
})

// Packaging own CSS code
gulp.task('sass', () => {
  gulp.src([
    'app/app.scss',
    'app/controller/**/*.scss',
    'app/component/**/*.scss',
  ])
  .pipe(plumber())
  .pipe(concat('rss.css'))
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(gulp.dest('public/css'))
  gulp.src('views/backend.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(gulp.dest('public/css'))
  gulp.src('app/screen.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(gulp.dest('public/css'))
})

gulp.task('watch', () => {
  // Auto watch and build
  gulp.watch(['app/*.js', 'app/**/*.js', 'app/**/**/*.js', 'helper/index.js'], ['js'])
  gulp.watch(['app/*.scss', 'app/**/*.scss', 'app/**/**/*.scss', 'views/*.scss'], ['sass'])
  gulp.watch(['app/controller/**/*.html', 'app/component/**/*.html'], ['template'])
})

// Task
gulp.task('default', ['angular', 'css', 'font', 'js', 'sass', 'template', 'watch'])
gulp.task('build', ['angular', 'css', 'font', 'js', 'sass', 'template'])
