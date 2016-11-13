var dev = true;
var debug = false;

//CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-cssnano');

//JS
var jshint = require('gulp-jshint');

//General
var gulp = require('gulp');
var browserSync = require('browser-sync');
var header  = require('gulp-header');
var rename = require('gulp-rename');
var notify = require("gulp-notify");
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');
var rm = require('gulp-rimraf');
var package = require('./package.json');
    module.exports = gulp;
//////////////////////////////////////////////////////////////////


var config = {
  threshold: '1kb'
};
var src = {
    "url"    : "./src",
    "markup" : "./src/*.html",
    "scripts": "./src/js/*",
    "styles" : "./src/styles/*",
    "images" : "./src/images/*",
    "fonts"  : "./src/fonts/*"
}
var dest = {
    "url"   : "./",
    "index" : "./onetab.html",
    "script": "./js/",
    "styles": "./css/",
    "images": "./images/",
    "fonts" : "./fonts/"
}

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('html', function () {
    return gulp.src(src.markup)
    .pipe(plumber())
    .pipe(gulp.dest(dest.url))
    .pipe(notify({title: package.name+' Message',message: "HTML loaded"}))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('img', function () {
    return gulp.src(src.images)
    .pipe(plumber())
    // .pipe(gzip(config))
    .pipe(gulp.dest(dest.images))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('css', function () {
    return gulp.src(src.styles)
    .pipe(plumber())
    .pipe(debug({title: 'CSS:'}))
    // .pipe(sourcemaps.init())
    .pipe(sass({
            errLogToConsole: true,
            //outputStyle: 'compressed',
            // outputStyle: 'compact',
            outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision: 10
     }).on('error', sass.logError))
    // .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer('last 4 version', '> 1%', 'safari 4', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(dest.styles)).on('error', gutil.log)
    .pipe(minifyCSS({
        postcssDiscardUnused: false,
        postcssZindex: false,
        postcssDiscardEmpty: true,
        postcssMergeRules: false
    })).on('error', gutil.log)
    .pipe(rename({suffix :".min" }))
    .pipe(gulp.dest(dest.styles)).on('error', gutil.log)
    .pipe(notify({title: package.name+' message',message: "CSS loaded"})).on('error', gutil.log)
    .pipe(browserSync.reload({stream:true})); 
});

gulp.task('js',function(){
    return gulp.src(src.scripts)
    .pipe(plumber())
    .pipe(debug({title: 'JS:'}))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(dest.scripts))
    .pipe(notify({title: package.name+' Message',message: "HTML loaded"}))
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(src.scripts))
    .pipe(browserSync.reload({stream:true, once: true}));
});

// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./",
//             index: "onetab.html"
//         },
//         host:"gjcpffobjmdpkomjbphechhnpnhmnfpa",
//         online:true
//     });
// });
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "onetab.html"
        },
        online:true
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['browser-sync','html','css'], function () {
    gulp.watch(src.images, ['img']);
    gulp.watch(src.markup, ['html']);
    gulp.watch(src.styles, ['css']);
    gulp.watch(src.scripts, ['js']);
    gulp.watch([src.markup,src.styles,src.scripts], ['bs-reload']);
});