import Streamer, {makeOptions} from './streamer';
import {PolytonFactory} from 'polyton';

const GulpStream = PolytonFactory( // eslint-disable-line new-cap
  Streamer, ['object', {
    type: 'object',
    optional: true,
  }, {
    type: 'object',
    optional: true,
  }], 'unique', {
    preprocess: function (args) {
      let _glob;
      let _pipe;
      let _dest;

      const _args = args.map(_args => {
        const {glob, pipe, dest} = makeOptions(_args);

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

        return [glob, pipe, dest];
      }).map(([glob, pipe, dest]) => {
        return [glob || _glob, pipe || _pipe, dest || _dest];
      });

      return _args;
    },
  });

export default GulpStream;
export {Streamer};
