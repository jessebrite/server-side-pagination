const {src, dest, series } = require('gulp');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const cleanCSS = require('gulp-clean-css');
const pipeline = require('readable-stream').pipeline;
const uglify = require('gulp-uglify');
const rename = require('gulp-rename')
//const colors = require('colors');

const nodemonOptions = {
  script: './bin/www',
  ex: 'js json',
  env: { NODE_ENV: 'development' },
  verbose: false,
  ignore: [],
  watch: ['app_api/*', 'app_server/*', 'app.js']
};

function compressJS() {
  return pipeline(
    gulp.src('public/javascripts/*.js'),
    uglify(),
    gulp.dest('dist/javascripts')
  );
}

function compressCSS() {
  return src('public/stylesheets/style.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(
      rename({
        dirname: 'dist/stylesheets',
        extname: '.min.css'
      })
    )
    .pipe(dest('./'));
}

gulp.task('default', series(compressJS, compressCSS));

gulp.task('watch', done => {
  nodemon(nodemonOptions).once('quit', () => {
    done();
  });
});
