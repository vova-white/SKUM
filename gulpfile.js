// generated on 2019-08-26 using generator-webapp 4.0.0-6
const { src, dest, watch, series, parallel, lastRun, task } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

function styles() {
  return src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe(
      $.sass
        .sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.']
        })
        .on('error', $.sass.logError)
    )
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(!isProd, $.sourcemaps.write()))
    .pipe(dest('.tmp/styles'))
    .pipe(server.reload({ stream: true }));
}

function scripts() {
  return src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe(dest('.tmp/scripts'))
    .pipe(server.reload({ stream: true }));
}

const lintBase = files => {
  return src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(server.reload({ stream: true, once: true }))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
};
function lint() {
  return lintBase('app/scripts/**/*.js').pipe(dest('app/scripts'));
}
function lintTest() {
  return lintBase('test/spec/**/*.js').pipe(dest('test/spec'));
}

function html() {
  return src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
    .pipe(
      $.if(/\.css$/, $.postcss([cssnano({ safe: true, autoprefixer: false })]))
    )
    .pipe(
      $.if(
        /\.html$/,
        $.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: { compress: { drop_console: true } },
          processConditionalComments: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        })
      )
    )
    .pipe(dest('dist'));
}

function images() {
  return src(['app/images/**/*', '!app/images/sprite/sprite.svg'], { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
}

function svgSpriteBuild() {
  return (
    src('app/images/svg/*.svg')
      // minify svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      // remove all fill, style and stroke declarations in out shapes
      .pipe(
        cheerio({
          run: function($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
          },
          parserOptions: { xmlMode: true }
        })
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: '../sprite.svg',
              render: {
                scss: {
                  dest: '../../../styles/_sprite.scss',
                  template: 'app/styles/templates/_sprite_template.scss'
                }
              }
            }
          }
        })
      )
      .pipe(dest('app/images/sprite'))
  );
}

function removeSprite() {
  return src('app/images/sprite/sprite.svg')
    .pipe(dest('dist/images/sprite/'));
}

function fonts() {
  return src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}').pipe(
    $.if(!isProd, dest('.tmp/fonts'), dest('dist/fonts'))
  );
}

function extras() {
  return src(['app/*', '!app/*.html'], {
    dot: true
  }).pipe(dest('dist'));
}

function clean() {
  return del(['.tmp', 'dist']);
}

function measureSize() {
  return src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
}

const build = series(
  clean,
  parallel(
    lint,
    series(svgSpriteBuild, parallel(styles, scripts), html),
    images,
    removeSprite,
    fonts,
    extras
  ),
  measureSize
);

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch(['app/*.html', 'app/images/**/*', '.tmp/fonts/**/*']).on(
    'change',
    server.reload
  );

  watch(['app/images/svg/*.svg']).on(
    'change',
    svgSpriteBuild
  );

  watch('app/styles/**/*.scss', styles);
  watch('app/scripts/**/*.js', scripts);
  watch('app/fonts/**/*', fonts);
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/node_modules': 'node_modules'
      }
    }
  });

  watch('app/scripts/**/*.js', scripts);
  watch(['test/spec/**/*.js', 'test/index.html']).on('change', server.reload);
  watch('test/spec/**/*.js', lintTest);
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

let serve;
if (isDev) {
  serve = series(clean, parallel(svgSpriteBuild, styles, scripts, fonts), startAppServer);
} else if (isTest) {
  serve = series(clean, scripts, startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
