import GulpStream from '../src/gulpstream';
import {validGlobs, validDests} from './helpers';
import {argsAsListsOfPlugins} from './pipe-helpers';
import isString from 'is-string';
import {expect} from 'chai';
import GulpGlob from 'gulpglob';
import PolyPipe from 'polypipe';
import GulpDest from 'gulpdest';

const wrapString = str => {
  if (isString(str)) {
    return `'${str}'`;
  }
  return str;
};

const print = arg => {
  if (!Array.isArray(arg)) {
    return wrapString(arg);
  }
  return `[${arg.map(wrapString).join(',')}]`;
};

const shuffle = a => {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]; // eslint-disable-line
  }
  return a;
};

describe('Testing GulpStream with mixed single Streamer args',
  function () {
    const globs = validGlobs();
    const dests = validDests();
    const plugins = argsAsListsOfPlugins;

    globs.forEach(glob => {
      dests.forEach(dest => {
        describe(`Using {glob: ${print(glob)}}, {dest: ${print(dest)}}`,
          function () {
            plugins.forEach(plugin => {
              const pipe = plugin.values;

              it(`and pipe {pipe: [${plugin.description}]}`, function () {
                const args = shuffle([{glob}, {dest}, {pipe}]);

                const streamer = (new GulpStream(args)).at(0);

                expect(streamer._glob).to.equal(new GulpGlob([glob]));
                expect(streamer._destination).to.equal(new GulpDest(dest));
                expect(streamer._pipe).to.equal(new PolyPipe(...pipe));
              });
            });
          });

        describe(`Using GulpGlob(${print(glob)}), GulpDest(${print(dest)})`,
          function () {
            plugins.forEach(plugin => {
              const pipe = plugin.values;

              it(`and PolyPipe(${plugin.description})`, function () {
                const args = shuffle([
                  new GulpGlob([glob]),
                  new GulpDest(dest),
                  new PolyPipe(...pipe),
                ]);

                const streamer = (new GulpStream(args)).at(0);

                expect(streamer._glob).to.equal(new GulpGlob([glob]));
                expect(streamer._destination).to.equal(new GulpDest(dest));
                expect(streamer._pipe).to.equal(new PolyPipe(...pipe));
              });
            });
          });

        describe(`Using mixed ${print(glob)}, mixed ${print(dest)}`,
          function () {
            plugins.forEach(plugin => {
              const pipe = plugin.values;

              it(`and mixed ${plugin.description}`, function () {
                const args = shuffle([
                  Math.random() < .5 ? new GulpGlob([glob]) : {glob},
                  Math.random() < .5 ? new GulpDest(dest) : {dest},
                  Math.random() < .5 ? new PolyPipe(...pipe) : {pipe},
                ]);

                const streamer = (new GulpStream(args)).at(0);

                expect(streamer._glob).to.equal(new GulpGlob([glob]));
                expect(streamer._destination).to.equal(new GulpDest(dest));
                expect(streamer._pipe).to.equal(new PolyPipe(...pipe));
              });
            });
          });
      });
    });
  });
