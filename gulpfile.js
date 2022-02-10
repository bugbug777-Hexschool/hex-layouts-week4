const { src, dest, watch, series, parallel } = require("gulp");
const $ = require("gulp-load-plugins")();
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();

let isBuild = false;

function copy_html(cb) {
  src("src/**/*.html").pipe(dest("public")).pipe(browserSync.stream());
  cb();
}

function compile_scss(cb) {
  src("src/assets/styles/**/*.scss")
    .pipe($.sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(isBuild, $.postcss([cssnano()])))
    .pipe($.sourcemaps.write("."))
    .pipe(dest("public/assets/styles"))
    .pipe(browserSync.stream());
  cb();
}

function compile_js(cb) {
  src("src/assets/scripts/**/*.js")
    .pipe($.sourcemaps.init())
    .pipe($.concat("all.js"))
    .pipe(
      $.babel({
        presets: ["@babel/env"],
      })
    )
    .pipe($.if(isBuild, $.uglify()))
    .pipe($.sourcemaps.write("."))
    .pipe(dest("public/assets/scripts"))
    .pipe(browserSync.stream());
  cb();
}

function copy_img(cb) {
  src("src/assets/images/**/*")
    .pipe($.if(isBuild, $.imagemin()))
    .pipe(dest("public/assets/images"))
    .pipe(browserSync.stream());
  cb();
}

function observe_files(cb) {
  watch("src/**/*.html", copy_html);
  watch("src/assets/styles/**/*.scss", compile_scss);
  watch("src/assets/scripts/**/*.js", compile_js);
  watch("src/assets/images/**/*", copy_img);
  cb();
}

function serve_files(cb) {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
    reloadDebounce: 1000,
  });
  cb();
}

function clean_files() {
  // 使用 cb() 傳送完成訊號會報錯，我也不知道為什麼。
  isBuild = true; // 暫時將要不要壓縮的 flag 放在這，反正 build 一定要先清檔案
  return src("public", { read: false, allowEmpty: true }).pipe($.clean());
}

function deploy_to_github(cb) {
  src("public/**/*").pipe($.ghPages());
  cb();
}

// Single test command
exports.html = copy_html;
exports.scss = compile_scss;
exports.babel = compile_js;
exports.image = copy_img;
exports.observe = observe_files;
exports.serve = serve_files;
exports.clean = clean_files;
exports.deploy = deploy_to_github;

// Before deploy
exports.build = series(
  clean_files,
  parallel(copy_html, compile_scss, compile_js, copy_img)
);
// Default command
exports.default = series(
  parallel(copy_html, compile_scss, compile_js, copy_img),
  observe_files,
  serve_files
);
