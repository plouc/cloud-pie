var gulp = require('gulp');

gulp.task('copy:fonts', function () {
    return gulp.src('./node_modules/font-awesome-stylus/fonts/*')
        .pipe(gulp.dest('./dist/fonts'))
    ;
});

gulp.task('copy', ['copy:fonts']);