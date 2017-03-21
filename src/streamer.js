import GulpGlob from 'gulpglob';
import PolyPipe from 'polypipe';
import GulpDest from 'gulpdest';

const preprocess = arg => Array.isArray(arg) ? arg : [arg];

export default class Streamer {
  constructor (options = {}) {
    const {glob, pipe, dest} = options;

    const _glob = new GulpGlob(glob);
    const _pipe = pipe !== undefined ? new PolyPipe(...preprocess(pipe)) : null;
    const _dest = dest !== undefined ? new GulpDest(...preprocess(dest)) : null;

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
