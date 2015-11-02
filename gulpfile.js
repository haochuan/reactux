var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');


var path = {
    HTML: 'src/index.html',
    ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
    MINIFIED_OUT: 'app.min.js',
    OUT: 'app.js',
    DEST: 'dist',
    DEST_BUILD: 'dist/build/',
    DEST_SRC: 'dist/src/',
    ENTRY_POINT: './src/js/App.js'
};


// Copy index.html from src to dist
gulp.task('copy', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});

// Replace the src path in <scipt> tag inside index.html
// Dev: src/app.js
// Production: build/app.min.js 
gulp.task('replaceHTML', function() {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT
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
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

// Watch the changes
gulp.task('watch', function() {
    gulp.watch(path.ALL, ['compile', 'copy']);
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
gulp.task('production', ['replaceHTML', 'build']);
