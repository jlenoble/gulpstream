import {expect} from 'chai';
import Streamer from '../src/streamer';
import equalFileContents from 'equal-file-contents';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

describe('Streamer can transpile files', function () {
  const dest = '/tmp/gulpdest-' + (new Date()).getTime();
  const glob = ['src/**/*.js', 'test/**/*.js'];
  const destglob = ['build/src/**/*.js', 'build/test/**/*.js'];

  it(`using glob [${glob}], dest '${dest}' and babel`, function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this
    let run = Promise.resolve();

    const func = function () {
      const dst = new Streamer({glob, dest: dest + '/build', pipe: [
        sourcemaps.init.bind(sourcemaps),
        babel,
        sourcemaps.write.bind(sourcemaps),
      ]});
      return dst.dest().isReady().then(() => equalFileContents(destglob, dest));
    };

    return run.then(func).catch(err => {
      try {
        expect(err).to.match(
          /Cannot delete files\/folders outside the current working directory\. Can be overriden with the `force` option/);
      } catch (e) {
        throw err;
      }
    });
  });
});
