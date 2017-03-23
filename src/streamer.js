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
    let _glob = findPolyton(args, SimpleGulpGlob) ||
      makePolyton(args, 'glob');
    let _pipe = findPolyton(args, MonoPipe) ||
      makePolyton(args, 'pipe');
    let _dest = findPolyton(args, SimpleGulpDest) ||
      makePolyton(args, 'dest');

    Object.defineProperties(this, {
      _glob: {
        get () {
          return _glob;
        },
      },
      _pipe: {
        get () {
          return _pipe;
        },
      },
      _destination: {
        get () {
          return _dest;
        },
      },
      glob: {
        get () {
          return _glob.glob;
        },
      },
      plugin: {
        get () {
          return _pipe.plugin.bind(_pipe);
        },
      },
      destination: {
        get () {
          return _dest.destination;
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
