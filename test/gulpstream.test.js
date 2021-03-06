import GulpStream from '../src/gulpstream';
import {validGlobs, validDests} from './helpers';
import {argsAsListsOfPlugins} from './pipe-helpers';
import {expect} from 'chai';

describe('Testing GulpStream', function () {
  const [glob1, glob2] = validGlobs();
  const [dest1, dest2] = validDests();
  const [plugin1, plugin2, plugin3] = argsAsListsOfPlugins;

  it(`GulpStream as two Streamers sharing only glob is valid`, function () {
    const gulpstream = new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin1.values,
      }],
      [{
        mode: 'other',
        glob: glob1,
        dest: dest2,
        pipe: plugin3.values,
      }]
    );

    const streamer1 = gulpstream.at(0);
    const streamer2 = gulpstream.at(1);

    expect(streamer1).not.to.equal(streamer2);

    expect(streamer1._glob).to.equal(streamer2._glob);
    expect(streamer1._destination).not.to.equal(streamer2._destination);
    expect(streamer1._pipe).not.to.equal(streamer2._pipe);
  });

  it(`GulpStream as two Streamers sharing only dest is invalid`, function () {
    expect(() => new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin1.values,
      }],
      [{
        mode: 'other',
        glob: glob2,
        dest: dest1,
        pipe: plugin3.values,
      }]
    )).to.throw(Error, 'Glob mismatch');
  });

  it(`GulpStream as two Streamers sharing only pipe is invalid`, function () {
    expect(() => new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin2.values,
      }],
      [{
        mode: 'other',
        glob: glob2,
        dest: dest2,
        pipe: plugin2.values,
      }]
    )).to.throw(Error, 'Glob mismatch');
  });

  it(`GulpStream as two Streamers sharing all is invalid`, function () {
    expect(() => new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin2.values,
      }],
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin2.values,
      }]
    )).to.throw(Error, `Mode already set: 'default'`);
  });

  it(`GulpStream as two Streamers sharing all but mode is invalid`,
    function () {
      expect(() => new GulpStream(
        [{
          glob: glob1,
          dest: dest1,
          pipe: plugin2.values,
        }],
        [{
          mode: 'other',
          glob: glob1,
          dest: dest1,
          pipe: plugin2.values,
        }]
      )).to.throw(Error, `Init Streamer args cannot only differ by 'mode'`);
    });

  it(`GulpStream as two Streamers with no default mode is invalid`,
    function () {
      expect(() => new GulpStream(
        [{
          mode: 'other1',
          glob: glob1,
          dest: dest1,
          pipe: plugin1.values,
        }],
        [{
          mode: 'other2',
          glob: glob1,
          dest: dest2,
          pipe: plugin3.values,
        }]
      )).to.throw(Error, `No 'default' mode set`);
    });
});
