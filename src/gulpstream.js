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

const _mode = Symbol();
const _streamer = Symbol();
const _streamers = Symbol();

const GulpStream = PolytonFactory( // eslint-disable-line new-cap
  Streamer, ['literal', 'object', {
    type: 'object',
    optional: true,
  }, {
    type: 'object',
    optional: true,
  }], ['unique', 'unordered'], {
    preprocess (args) {
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

    properties: {
      [_mode]: {
        value: 'default',
        writable: true,
      },

      [_streamer]: {
        value: null,
        writable: true,
      },

      [_streamers]: {
        value: {},
      },

      mode: {
        get () {
          return this[_mode];
        },
      },

      streamer: {
        get () {
          return this[_streamer];
        },
      },

      cwd: {
        get () {
          return this[_streamer].cwd;
        },
      },

      base: {
        get () {
          return this[_streamer].base;
        },
      },

      paths: {
        get () {
          return this[_streamer].paths;
        },
      },

      glob: {
        get () {
          return this[_streamer].glob;
        },
      },

      plugin: {
        get () {
          return this[_streamer].plugin;
        },
      },

      destination: {
        get () {
          return this[_streamer].destination;
        },
      },
    },

    postprocess (instance, args) {
      instance.forEach(p => {
        instance[_streamers][p.mode] = p; // eslint-disable-line no-param-reassign, max-len
      });
      instance[_streamer] = instance[_streamers][instance[_mode]]; // eslint-disable-line no-param-reassign, max-len
      return instance;
    },

    extend: {
      setMode (mode) {
        if (typeof mode === 'string') {
          const strm = this[_streamers][mode];

          if (strm) {
            this[_mode] = mode;
            this[_streamer] = strm;
          } else {
            throw new Error(`Mode ${mode} is undefined`);
          }
        } else {
          throw new TypeError('Mode must be set with a string');
        }
      },

      src (options = {read: true, mode: 'default'}) {
        this.setMode(options.mode);
        return this[_streamer].src(options);
      },

      list () {
        this.setMode('default');
        return this[_streamer].list();
      },

      stream (options = {read: true, mode: 'default'}) {
        this.setMode(options.mode);
        return this[_streamer].stream(options);
      },

      dest (options = {read: true, mode: 'default'}) {
        this.setMode(options.mode);
        return this[_streamer].dest(options);
      },
    },
  });

export default GulpStream;
export {Streamer};
