var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('styles', function () {
    return gulp.src('client/scss/styles.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: '../scss'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('client/css'));
});

gulp.task('default', ['styles'], function() {
    gulp.watch('client/scss/*', ['styles']);
});