var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('browserify');
var watchify   = require('watchify');
var babelify   = require('babelify');
var chalk      = require('chalk');
var source     = require('vinyl-source-stream');

function getBundler(isDev) {
    var bundler = browserify({
        entries:      ['./src/js/app.js'],
        extensions:   ['.js'],
        debug:        isDev,
        cache:        {},  // for watchify
        packageCache: {},  // for watchify
        fullPaths:    true // for watchify
    });

    bundler.transform(babelify);

    return bundler;
}

gulp.task('js', function () {
    return getBundler(true)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
    ;
});

gulp.task('copy:fonts', function () {
    return gulp.src('./node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('./dist/fonts'))
    ;
});

gulp.task('copy:css', function () {
    return gulp.src('./node_modules/font-awesome/css/*')
        .pipe(gulp.dest('./dist/css'))
    ;
});

gulp.task('copy', ['copy:fonts', 'copy:css']);

gulp.task('watch:js', function () {
    var watcher = watchify(getBundler(true));

    return watcher
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .on('update', function () {
            watcher.bundle()
                .pipe(source('app.js'))
                .pipe(gulp.dest('./dist/js'))
            ;

            gutil.log(chalk.green('Updated JavaScript sources'));
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
    ;
});

gulp.task('build', ['js', 'copy']);

gulp.task('watch', ['watch:js']);

gulp.task('default', ['build']);