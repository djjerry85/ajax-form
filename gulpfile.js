const gulp = require('gulp'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    modifyURL = require('gulp-modify-css-urls'),
    fileinclude = require('gulp-file-include'),
    replace = require('gulp-replace'),
    path = require('path'),
    del = require ('del'),
    plugins = require('gulp-load-plugins')();


const baseFolder = '.';

const paths = {
    assets: {
        js:     baseFolder + '/dist/'
    },
    src: {
        js:     baseFolder + '/src/js/*.js'
    },
    watch: {
        js:     baseFolder + '/src/js/**/*.js'
    }
};

const onError = function(err) {
    plugins.notify.onError({
        title:   err.plugin,
        message: err.message
    })(err);
};



/* ********************** TASKS ********************** */

gulp.task('clean', () => del([
    paths.assets.js
], {dot: true}));


gulp.task('scripts', () => {
    return gulp.src(paths.src.js)
        .pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.debug({title: 'js:'}))
        .pipe(plugins.babel({
            presets: ['env']
        }))
        .pipe(plugins.concat('s-ajax-form.js'))
        .pipe(plugins.debug({title: 'jsconcat:'}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.assets.js));
});




gulp.task('build', gulp.series(
    //'clean',
    gulp.parallel(['scripts']))
);


gulp.task('watch', () => {
    gulp.watch(paths.watch.js, gulp.series('scripts'));
});

gulp.task('default', gulp.series('build', gulp.parallel('watch')));


