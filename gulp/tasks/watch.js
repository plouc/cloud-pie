var gulp = require('gulp');

gulp.task('watch:styles:dev', function () {
    return gulp.watch('./src/styles/**/*.styl', ['styles:dev']);
});

gulp.task('watch:styles', function () {
    return gulp.watch('./src/styles/**/*.styl', ['styles']);
});

gulp.task('watch:dev', ['watch:styles:dev', 'watch:js:dev']);
gulp.task('watch',     ['watch:styles',     'watch:js']);