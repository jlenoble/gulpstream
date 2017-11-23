import GulpStream from '../src/gulpstream';
import GulpGlob from 'gulpglob';
import GulpDest from 'gulpdest';
import PolyPipe from 'polypipe';
import babel from 'gulp-babel';
import {expect} from 'chai';

describe('Testing Readme.md examples', function () {
  it(`First example`, function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this

    const glob = 'src/*.js';
    const dest = 'build';
    const pipe = [babel];

    const g1 = new GulpStream([{glob, dest, pipe}]);
    const g2 = new GulpStream([
      new GulpGlob(glob),
      new GulpDest(dest),
      new PolyPipe(pipe),
    ]);

    expect(g1).to.equal(g2);
  });
});
