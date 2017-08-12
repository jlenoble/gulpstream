import path from 'path';
import {expect} from 'chai';
import Streamer from '../src/streamer';
import GulpDest from 'gulpdest';
import {validDests, invalidDests, validGlobs} from './helpers';
import {tmpDir} from 'cleanup-wrapper';
import equalFileContents from 'equal-file-contents';

const cwd = process.cwd();

describe('Streamer is a class encapsulting gulp.dest', function () {
  it(`A Streamer instance can't be initialized from an invalid dest argument`,
    function () {
      const [validGlob] = validGlobs();
      invalidDests().forEach(dest => {
        expect(() => new Streamer({
          glob: validGlob,
          dest,
        }))
          .to.throw(TypeError, /Invalid dest element:/);
      });
    });

  it(`A Streamer instance can be initialized from a GulpDest argument`,
    function () {
      validDests().forEach(dest => {
        expect(() => new Streamer({
          glob: ['src/**/*.js'],
          dest: new GulpDest(dest),
        }))
          .not.to.throw();
      });
    });

  it('A Streamer instance has a non-writable member destination', function () {
    const [validGlob] = validGlobs();
    validDests().forEach(dest => {
      const dst = new Streamer({
        glob: validGlob,
        dest,
      });
      expect(dst.destination).to.eql(path.join(cwd, path.relative(cwd, dest)));
      expect(() => {
        dst.destination = 'tmp';
      }).to.throw(TypeError,
        /Cannot assign to read only property 'destination'/);
    });
  });


  const dests = validDests();
  it('A Streamer instance can write streams', function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this
    let run = Promise.resolve();

    dests.forEach(dest => {
      const glob = ['src/**/*.js', 'test/**/*.js'];

      const func = tmpDir(dest, function () {
        const dst = new Streamer({glob, dest});
        return dst.dest().isReady().then(() => equalFileContents(glob, dest));
      });

      run = run.then(func).catch(err => {
        try {
          expect(err).to.match(
            /Cannot delete files\/folders outside the current working directory\. Can be overriden with the `force` option/);
        } catch (e) {
          throw err;
        }
      });
    });

    return run;
  });
});
