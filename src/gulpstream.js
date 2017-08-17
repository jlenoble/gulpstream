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
      const _args = args.map(_args => {
        const {glob, pipe, dest} = makeOptions(_args);
        return [glob, pipe, dest];
      });

      return _args;
    },
  });

export default GulpStream;
export {Streamer};
