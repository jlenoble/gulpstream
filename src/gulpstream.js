import Streamer, {makeOptions} from './streamer';
import {PolytonFactory} from 'polyton';
import {unequiv} from 'keyfunc';

const uneq = unequiv({
  type: 'array',
  sub: ['ignore', {
    type: 'object',
    ntimes: 3,
  }],
});

const GulpStream = PolytonFactory( // eslint-disable-line new-cap
  Streamer, ['literal', 'object', {
    type: 'object',
    optional: true,
  }, {
    type: 'object',
    optional: true,
  }], ['unique', 'unordered'], {
    preprocess: function (args) {
      let _glob;
      let _pipe;
      let _dest;

      const modes = {};

      const _args = args.map(_args => {
        const {glob, pipe, dest, mode} = makeOptions(_args);

        if (glob) {
          if (!_glob) {
            _glob = glob;
          } else if (glob !== _glob) {
            throw new Error(`Glob mismatch: ${JSON.stringify(glob.glob
            )} != ${JSON.stringify(_glob.glob)}`);
          }
        }

        if (pipe && !_pipe) {
          _pipe = pipe;
        }

        if (dest && !_dest) {
          _dest = dest;
        }

        if (modes[mode]) {
          throw new Error(`Mode already set: '${mode}'`);
        }

        modes[mode] = true;

        return [mode, glob, pipe, dest];
      }).map(([mode, glob, pipe, dest]) => {
        return [mode, glob || _glob, pipe || _pipe, dest || _dest];
      });

      if (!modes['default']) {
        throw new Error(`No 'default' mode set`);
      }

      if (!uneq(..._args)) {
        throw new Error(`Init Streamer args cannot only differ by 'mode'`);
      }

      return _args;
    },
  });

export default GulpStream;
export {Streamer};
