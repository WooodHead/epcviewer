var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require("gulp-jade");
var del = require('del');
var package = require("./package.json");

gulp.task('watch', function(){
  gulp.watch(['src/jade/**/*.jade'], ['jade']);
});

// jadeコンパイル
gulp.task('jade', function(){
  gulp.src('src/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/html/'));
});

// distを空に
gulp.task('clean', function(cb) {
  del(['dist', '**/*.log'], cb);
});

gulp.task('default', ['jade']);