import GulpGlob from 'gulpglob';
import GulpDest from 'gulpdest';
import PolyPipe from 'polypipe';
import GulpStream from '../src/gulpstream';
import {validGlobs, validDests} from './helpers';
import {argsAsListsOfPlugins} from './pipe-helpers';
import {expect} from 'chai';

describe(`Testing mode switch for GulpStream`, function () {
  const [glob1] = validGlobs();
  const [dest1, dest2] = validDests();
  const [plugin1, plugin2, plugin3] = argsAsListsOfPlugins;

  const o1 = ['default', new GulpGlob(glob1), new PolyPipe(...plugin1.values),
    new GulpDest(dest1)];
  const o2 = ['other1', new GulpGlob(glob1), new PolyPipe(...plugin2.values),
    new GulpDest(dest2)];
  const o3 = ['other2', new GulpGlob(glob1), new PolyPipe(...plugin3.values),
    new GulpDest(dest2)];

  it(`Checking streamers don't already exist from another test`, function () {
    expect(GulpStream.get(o1, o2, o3)).to.be.undefined;
  });

  it(`On init, mode is 'default'`, function () {
    const gs = new GulpStream(o1, o2, o3);
    expect(gs.mode).to.equal('default');
  });

  it(`On init, streamer is set to default streamer`, function () {
    const gs = GulpStream.get(o1, o2, o3);
    expect(gs.streamer.mode).to.equal('default');
  });

  it(`Changing mode to 'other1' changes streamer to 'other1' too`, function () {
    const gs = GulpStream.get(o1, o2, o3);

    expect(gs.mode).to.equal('default');
    expect(gs.streamer.mode).to.equal('default');

    gs.setMode('other1');

    expect(gs.mode).to.equal('other1');
    expect(gs.streamer.mode).to.equal('other1');

    gs.setMode('default');

    expect(gs.mode).to.equal('default');
    expect(gs.streamer.mode).to.equal('default');
  });
});
