import GulpStream from '../src/gulpstream';
import {validGlobs, validDests} from './helpers';
import {argsAsListsOfPlugins} from './pipe-helpers';
import {expect} from 'chai';

describe('Testing GulpStream', function () {
  const [glob1, glob2] = validGlobs();
  const [dest1, dest2] = validDests();
  const [plugin1, plugin2, plugin3] = argsAsListsOfPlugins;

  it(`GulpStream as two Streamers sharing glob`, function () {
    const gulpstream = new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin1.values,
      }],
      [{
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

  it(`GulpStream as two Streamers sharing dest`, function () {
    const gulpstream = new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin1.values,
      }],
      [{
        glob: glob2,
        dest: dest1,
        pipe: plugin3.values,
      }]
    );

    const streamer1 = gulpstream.at(0);
    const streamer2 = gulpstream.at(1);

    expect(streamer1).not.to.equal(streamer2);

    expect(streamer1._glob).not.to.equal(streamer2._glob);
    expect(streamer1._destination).to.equal(streamer2._destination);
    expect(streamer1._pipe).not.to.equal(streamer2._pipe);
  });

  it(`GulpStream as two Streamers sharing pipe`, function () {
    const gulpstream = new GulpStream(
      [{
        glob: glob1,
        dest: dest1,
        pipe: plugin2.values,
      }],
      [{
        glob: glob2,
        dest: dest2,
        pipe: plugin2.values,
      }]
    );

    const streamer1 = gulpstream.at(0);
    const streamer2 = gulpstream.at(1);

    expect(streamer1).not.to.equal(streamer2);

    expect(streamer1._glob).not.to.equal(streamer2._glob);
    expect(streamer1._destination).not.to.equal(streamer2._destination);
    expect(streamer1._pipe).to.equal(streamer2._pipe);
  });

  it(`GulpStream as two Streamers sharing all`, function () {
    const gulpstream = new GulpStream(
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
    );

    const streamer2 = gulpstream.at(1);

    expect(streamer2).to.be.undefined;
    expect(gulpstream).to.have.length(1);
    expect(gulpstream.elements).to.have.length(1);
  });
});
