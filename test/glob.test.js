import path from 'path';
import Muter, {muted} from 'muter';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Streamer from '../src/streamer';
import GulpGlob from 'gulpglob';
import {invalidGlobs, validGlobs, validDest, fileList, fileSrc,
  equalLists} from './helpers';
import {tmpDir} from 'cleanup-wrapper';
import equalStreamContents from 'equal-stream-contents';
import equalFileContents from 'equal-file-contents';
import {toArrayOfArrays} from 'argu';

chai.use(chaiAsPromised);

describe('Streamer is a class encapsulting gulp.src', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`A Streamer instance can't be initialized from an invalid glob argument`,
    function () {
      invalidGlobs().forEach(glob => {
        expect(() => new Streamer({glob}))
          .to.throw(TypeError, /Invalid glob element:/);
      });
    });

  it(`A Streamer instance can be initialized from a GulpGlob argument`,
    function () {
      validGlobs().forEach(glob => {
        expect(() => new Streamer({glob: new GulpGlob([glob])}))
          .not.to.throw();
      });

      validGlobs().forEach(glob => {
        expect(() => new Streamer(new GulpGlob([glob])))
          .not.to.throw();
      });

      expect(() => new Streamer(...validGlobs().map(glob =>
        new GulpGlob([glob])))).not.to.throw();
    });

  it('A Streamer instance has a non-writable member glob', function () {
    const globs = validGlobs();
    globs.forEach(glob => {
      const glb = new Streamer({glob});
      expect(glb.glob).to.eql((Array.isArray(glob) ? glob : [glob]).map(
        a => path.relative(process.cwd(), a)
      ).sort());
      expect(() => {
        glb.glob = 'package.json';
      }).to.throw(TypeError, /Cannot assign to read only property 'glob'/);
    });
  });

  it('A Streamer instance can source files', function () {
    const p = Promise.all(validGlobs().map(glob => {
      // Pass a valid glob as init arg
      const glb = new Streamer({glob});
      const src = glb.src();
      const refSrc = fileSrc(glob);

      return equalStreamContents(src, refSrc);
    }));

    return p.then(() => Promise.all(validGlobs().map(glob => {
      // Pass same valid glob as init arg, but spread in single subglobs
      const glbs = toArrayOfArrays(glob);
      const glb = new Streamer(...glbs.map(glob => ({glob})));
      const src = glb.src();
      const refSrc = fileSrc(glob);

      return equalStreamContents(src, refSrc);
    })));
  });

  it('A Streamer instance can list files', muted(muter, function () {
    return Promise.all(validGlobs().map(glob => {
      const glb = new Streamer({glob});
      const list = glb.list();
      const refList = fileList(glob);

      return Promise.all([
        equalLists(list, refList),
        list.then(() => {
          const logs = muter.getLogs().split('\n')
            .filter(el => el !== '').sort();
          muter.forget();
          return expect(refList.then(l => l.sort()))
            .to.eventually.eql(logs);
        }),
      ]);
    }));
  }));

  it('A Streamer instance can copy files', function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this
    let run = Promise.resolve();
    [
      '/tmp/gulpglob-test_' + new Date().getTime(),
      'tmp',
    ].forEach(dest => {
      validGlobs().forEach((glob, i) => {
        const func = function (dest) {
          const destGlb = validDest(dest);
          const glb = new Streamer({glob, dest});
          const dst = glb.dest();

          expect(dst.paths).to.eql(destGlb[i].sort());

          let _glb = glob;
          if (Array.isArray(glob)) {
            _glb = [...glob];
            _glb.push('!' + dest);
          }
          return dst.isReady().then(() => equalFileContents(_glb, dest));
        };
        run = run.then(tmpDir(dest + i, func.bind(undefined, dest + i)))
          .catch(err => {
            try {
              expect(err).to.match(
                /Cannot delete files\/folders outside the current working directory\. Can be overriden with the `force` option/);
            } catch (e) {
              throw err;
            }
          });
      });
    });
    return run;
  });
});
