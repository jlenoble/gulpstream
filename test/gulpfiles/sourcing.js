import GulpStream from './src/gulpstream';
import gulp from 'gulp';
import newer from 'gulp-newer';

const glob = ['test/**/*.js'];
const dest = 'build';
const pipe = [[newer, dest]];

const gs = new GulpStream(
  [{glob, dest}],
  ['newer', {glob, dest, pipe}],
);

gulp.task('default', () => gs.src());
gulp.task('newer', () => gs.src({mode: 'newer'}));
