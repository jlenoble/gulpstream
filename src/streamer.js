import GulpGlob, {SimpleGulpGlob} from 'gulpglob';
import PolyPipe, {MonoPipe} from 'polypipe';
import GulpDest, {SimpleGulpDest} from 'gulpdest';

const makeArray = arg => Array.isArray(arg) ? arg : [arg];

const findPolyton = (args, Class) => {
  let res = null;

  args.some(arg => {
    const elements = arg && arg.elements;
    res = Array.isArray(elements) ? elements[0] : null;
    res = res instanceof Class ? arg : null;
    return res;
  });

  return res;
};

const makePolyton = (args, prop) => {
  let res = null;

  args.some(arg => {
    const obj = arg && arg[prop];

    if (obj !== undefined) {
      switch (prop) {
      case 'glob':
        res = new GulpGlob(obj);
        break;

      case 'dest':
        if (typeof obj === 'function') {
          break;
        }
        res = new GulpDest(...makeArray(obj));
        break;

      case 'pipe':
        res = new PolyPipe(...makeArray(obj));
        break;
      }
    }

    return res;
  });

  return res;
};

export default class Streamer {
  constructor (...args) {
    let glob = findPolyton(args, SimpleGulpGlob) ||
      makePolyton(args, 'glob');
    let pipe = findPolyton(args, MonoPipe) ||
      makePolyton(args, 'pipe');
    let dest = findPolyton(args, SimpleGulpDest) ||
      makePolyton(args, 'dest');

    Object.defineProperties(this, {
      _glob: {
        get () {
          return glob;
        },
      },
      _pipe: {
        get () {
          return pipe;
        },
      },
      _destination: {
        get () {
          return dest;
        },
      },
      glob: {
        get () {
          return glob.glob;
        },
      },
      plugin: {
        get () {
          return pipe.plugin.bind(pipe);
        },
      },
      destination: {
        get () {
          return dest.destination;
        },
      },
    });
  }

  src () {
    return this._glob.src();
  }

  list () {
    return this._glob.list();
  }

  stream () {
    let stream = this._glob.src();

    if (this._pipe) {
      stream = this._pipe.through(stream);
    }

    return stream;
  }

  plugin () {
    let stream = this._glob.src();

    if (this._pipe) {
      stream = this._pipe.through(stream);
    }

    return stream;
  }

  dest () {
    let stream = this._glob.src();

    if (this._pipe) {
      stream = this._pipe.stream(stream);
    }

    return this._destination.dest(stream, this.glob);
  }
}
