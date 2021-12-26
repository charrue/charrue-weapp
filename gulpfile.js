const gulp = require('gulp');
const path = require('path');

const exampleDir = path.resolve(__dirname, './example/dist');
const src = path.resolve(__dirname, './packages');

// const packageNameReg = /packages\\(\w+)\\src/
const copeToDistNew = () =>  gulp
    .src([
      `${src}/**/*.js`,
      `${src}/**/*.wxml`,
      `${src}/**/*.wxss`,
      `${src}/**/*.json`,
      `!${src}/**/package.json`,
    ])
    .pipe(gulp.dest(exampleDir))


exports.default = gulp.series(
  gulp.parallel(
    () => copeToDistNew(),
    () => {
      gulp.watch([
        `${src}/**/*.js`,
        `${src}/**/*.wxml`,
        `${src}/**/*.wxss`,
        `${src}/**/*.json`,
      ], gulp.series(() => copeToDistNew()));
    }
  )
);
