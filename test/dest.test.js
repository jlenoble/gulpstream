import path from 'path';
import {expect} from 'chai';
import Streamer from '../src/streamer';
import GulpDest from 'gulpdest';
import {validDests, invalidDests, validGlobs} from './helpers';
import {tmpDir} from 'cleanup-wrapper';
import equalFileContents from 'equal-file-contents';

const cwd = process.cwd();

function join (...args) {
  let len = args.length;
  let glob = args[len - 1];

  if (!Array.isArray(glob)) {
    glob = [glob];
  }

  args.pop();

  return glob.map(str => path.join(...args, str));
}

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
      let dsts = Array.isArray(dest) ? dest : [dest];
      dsts = dsts.map(d => path.relative(cwd, d));
      expect(dst.destination).to.eql(dsts);
      expect(() => {
        dst.destination = 'tmp';
      }).to.throw(TypeError, /Cannot set property destination/);
    });
  });

  it('A Streamer instance can write streams', tmpDir(validDests(), function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this
    const glob = ['src/**/*.js', 'test/**/*.js'];
    const dests = validDests();
    const dst = new Streamer({
      glob,
      dest: dests,
    });

    const glb = dst.dest();

    return glb.toPromise().then(globs => {
      return Promise.all(globs.map((_glb, i) => {
        return equalFileContents(glob, dests[i]);
      }));
    });
  }));

  it('A Streamer instance wraps unordered dests', tmpDir(
  ['tmp1', 'tmp2'], function () {
    const glob = ['src/**/*.js', 'test/**/*.js'];
    const dests = ['tmp2', 'tmp1'];
    const revDests = ['tmp1', 'tmp2'];

    const dst = new Streamer({
      glob,
      dest: dests,
    });
    const revDst = new Streamer({
      glob,
      revDests,
    });

    expect(dst._dest).to.equal(revDst._dest);

    const glb = dst.dest();

    return glb.toPromise().then(globs => {
      expect(globs.map(glb => glb.glob))
        .to.eql(dests.map(dest => {
          return join(dest, glob);
        }));
    });
  }));
});
