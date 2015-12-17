var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');


var path = {
    HTML: 'src/index.html',
    SASS: 'src/sass/main.scss',
    ALL: ['src/*.js', 'src/**/*.js', 'src/index.html', 'src/sass/**/*.scss'],
    MINIFIED_OUT: 'app.min.js',
    MINIFIED_CSS: 'main.css',
    OUT: 'app.js',
    DEST: 'dist',
    DEST_BUILD: 'dist/build/',
    DEST_DEV: 'dist/dev/',
    ENTRY_POINT: './src/App.js'
};


// Copy index.html from src to dist
gulp.task('copy', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});


gulp.task('sass_dev', function() {
    gulp.src(path.SASS)
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(gulp.dest(path.DEST_DEV));
});

gulp.task('sass_build', function() {
    gulp.src(path.SASS)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(path.DEST_BUILD));
});

// Replace the src path in <scipt> tag inside index.html
// Dev: src/app.js
// Production: build/app.min.js 
gulp.task('replaceHTML', function() {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT,
            'css': 'build/' + path.MINIFIED_CSS
        }))
        .pipe(gulp.dest(path.DEST));
});

// Compile ES6 and JSX
gulp.task('compile', function() {
    browserify({
            entries: [path.ENTRY_POINT],
            extensions: ['.js'],
        })
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
        console.log(err.message);
        this.emit('end');
    })
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_DEV));
});

// Watch the changes
gulp.task('watch', function() {
    gulp.watch(path.ALL, ['sass_dev', 'compile', 'copy']);
});

// Build the min.js for production
// Also will change the src path in <script> tag in HTML
gulp.task('build', function() {
    browserify({
            entries: [path.ENTRY_POINT],
            extensions: ['.js'],
        })
        .transform(babelify)
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
         .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(path.DEST_BUILD));
});

// Register Tasks
gulp.task('default', ['watch']);
gulp.task('production', ['replaceHTML', 'sass_build', 'build']);
