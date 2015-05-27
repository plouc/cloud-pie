var gulp       = require('gulp');
var browserify = require('browserify');
var reactify   = require('reactify');
var uglify     = require('gulp-uglify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var rename     = require('gulp-rename');
var watchify   = require('watchify');
var gutil      = require('gulp-util');
var chalk      = require('chalk');


function getBundler(isDev) {
    var bundler = browserify({
        entries:      ['./src/js/App.jsx'],
        extensions:   ['.js', '.jsx'],
        debug:        isDev,
        cache:        {},  // for watchify
        packageCache: {},  // for watchify
        fullPaths:    true // for watchify
    });

    bundler.transform(reactify, {
        es6: true
    });

    return bundler;
}

gulp.task('watch:js', function () {
    var watcher = watchify(getBundler(true));

    return watcher
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .on('update', function () {
            watcher.bundle()
                .pipe(source('app.js'))
                .pipe(gulp.dest('./dist/js'))
                .pipe(buffer())
                .pipe(uglify())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('./dist/js'))
            ;

            gutil.log(chalk.green('Updated JavaScript sources'));
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/js'))
    ;
});

gulp.task('watch:js:dev', function () {
    var watcher = watchify(getBundler(true));

    return watcher
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .on('update', function () {
            watcher.bundle()
                .pipe(source('app.js'))
                .pipe(buffer())
                .pipe(gulp.dest('./dist/js'))
            ;

            gutil.log(chalk.green('Updated JavaScript sources [dev]'));
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
    ;
});


gulp.task('js:dev', function () {
    return getBundler(true)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
    ;
});


gulp.task('js', ['js:dev'], function () {
    return gulp.src('./dist/gallery.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'))
    ;
});