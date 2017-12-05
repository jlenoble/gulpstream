import GulpStream from './src/gulpstream';
import gulp from 'gulp';
import newer from 'gulp-newer';
import babel from 'gulp-babel';

const glob = ['test/**/*.js'];
const dest = 'build';
const pipe = [[newer, dest]];

const gs = new GulpStream(
  [{glob, dest}],
  ['newer', {glob, dest, pipe}],
  ['babel', {glob, dest, pipe: babel}],
);

gulp.task('default', () => gs.dest().isReady());
gulp.task('newer', () => gs.dest({mode: 'newer'}).isReady());
gulp.task('babel', () => gs.dest({mode: 'babel'}).isReady());
