var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');

gulp.task('build-client', function() {
    gulp.src('./src/client.js')
        .pipe(browserify({
          standalone: 'multiroids-client.js',
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('build-multiroids', function() {
    gulp.src('./src/multiroids.js')
        .pipe(browserify({
          standalone: 'Multiroids',
          debug : false
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['lint', 'build-multiroids']);
});

gulp.task('default', ['lint', 'build-multiroids', 'watch']);