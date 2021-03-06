import Streamer, {makeOptions} from './streamer';
import {PolytonFactory} from 'polyton';
import PolyPipe from 'polypipe';
import {noop} from 'gulp-util';
import {unequiv} from 'keyfunc';

const uneq = unequiv({
  type: 'array',
  sub: ['ignore', {
    type: 'object',
    ntimes: 3,
  }],
});

const emptyDest = {};

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

        if (!_pipe) {
          _pipe = new PolyPipe([noop]);
        }

        if (dest && !_dest) {
          _dest = dest;
        }

        if (!_dest) {
          _dest = emptyDest;
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

      // [_streamers] is defined in postprocess as it is an object, and defined
      // here it would be shared across all instances

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
      /* eslint-disable no-param-reassign */
      instance[_streamers] = {};
      instance.forEach(p => {
        instance[_streamers][p.mode] = p;
      });
      instance[_streamer] = instance[_streamers][instance[_mode]];
      return instance;
      /* eslint-enable no-param-reassign */
    },

    extend: {
      setMode (mode) {
        const md = typeof mode === 'string' ? mode : 'default';
        const strm = this[_streamers][md];

        if (strm) {
          this[_mode] = md;
          this[_streamer] = strm;
        } else {
          this[_mode] = 'default';
          this[_streamer] = this[_streamers]['default'];
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
export {Streamer, makeOptions};
