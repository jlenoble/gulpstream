import GulpGlob from 'gulpglob';
import GulpDest from 'gulpdest';
import PolyPipe from 'polypipe';
import {validGlobs, validDests} from './helpers';
import {argsAsListsOfPlugins} from './pipe-helpers';
import {expect} from 'chai';
import {unequiv} from 'keyfunc';

describe(`Testing custom unequiv for GulpStream`, function () {
  const [glob1] = validGlobs();
  const [dest1, dest2] = validDests();
  const [plugin1, plugin2, plugin3] = argsAsListsOfPlugins;

  const o1 = ['default', new GulpGlob(glob1), new GulpDest(dest1),
    new PolyPipe(...plugin1.values)];
  const o2 = ['other1', new GulpGlob(glob1), new GulpDest(dest2),
    new PolyPipe(...plugin2.values)];
  const o3 = ['other2', new GulpGlob(glob1), new GulpDest(dest2),
    new PolyPipe(...plugin3.values)];
  const o4 = ['other3', new GulpGlob(glob1), new GulpDest(dest2),
    new PolyPipe(...plugin3.values)];

  const uneq = unequiv({
    type: 'array',
    sub: ['ignore', {
      type: 'object',
      ntimes: 3,
    }],
  });

  it(`Sharing glob only`, function () {
    expect(uneq(o1, o2)).to.be.true;
  });

  it(`Sharing glob and dest`, function () {
    const uneq = unequiv('object');

    expect(uneq(o2, o3)).to.be.true;
  });

  it(`Sharing all but mode`, function () {
    expect(uneq(o3, o4)).to.be.false;
  });

  it(`3 different args`, function () {
    expect(uneq(o1, o2, o3)).to.be.true;
  });

  it(`4 different args, but 2 sharing all but mode`, function () {
    expect(uneq(o1, o2, o3, o4)).to.be.false;
  });
});
