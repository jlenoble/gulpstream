import GulpGlob, {SimpleGulpGlob} from 'gulpglob';
import GulpDest, {SimpleGulpDest} from 'gulpdest';
import PolyPipe, {MonoPipe} from 'polypipe';
import {toArrayOfArrays} from 'argu';

const getMode = arg => {
  if (typeof arg === 'string') {
    return arg;
  }

  if (arg && arg.mode) {
    return arg.mode;
  }

  return 'default';
};

const getGlobArg = arg => {
  if (arg instanceof SimpleGulpGlob) {
    return arg;
  }

  if (arg && arg.glob) {
    return new GulpGlob(...toArrayOfArrays(arg.glob));
  }
};

const getPipeArg = arg => {
  if (arg instanceof MonoPipe || arg instanceof PolyPipe.BasePolyton) {
    return arg;
  }

  if (arg && arg.pipe) {
    return new PolyPipe(...toArrayOfArrays(arg.pipe));
  }
};

const getDestArg = arg => {
  if (arg instanceof SimpleGulpDest) {
    return new GulpDest(arg);
  }

  if (arg && arg.dest !== undefined && typeof arg.dest !== 'function') {
    return new GulpDest(arg.dest);
  }
};

export const makeOptions = args => {
  const globs = [];
  const pipes = [];
  let dest;
  let mode;

  args.forEach(arg => {
    const glb = getGlobArg(arg);
    const pipe = getPipeArg(arg);

    if (glb) {
      globs.push(glb);
    }

    if (pipe) {
      pipes.push(pipe);
    }

    if (dest === undefined) {
      dest = getDestArg(arg);
    }

    if (mode === undefined) {
      mode = getMode(arg);
    }
  });

  return {
    glob: new GulpGlob(...globs),
    pipe: pipes.length ? new PolyPipe(...pipes) : undefined,
    dest, mode,
  };
};

export default class Streamer {
  constructor (...args) {
    const {glob, pipe, dest, mode} = makeOptions(args);

    Object.defineProperties(this, {
      _glob: {
        value: glob,
      },

      _pipe: {
        value: pipe,
      },

      _destination: {
        value: dest,
      },

      mode: {
        value: mode,
      },

      cwd: {
        value: glob && glob.cwd,
      },

      base: {
        value: glob && glob.base,
      },

      paths: {
        value: glob && glob.paths,
      },

      glob: {
        value: glob && glob.glob,
      },

      plugin: {
        value: pipe && pipe.plugin.bind(pipe),
      },

      destination: {
        value: dest && dest.destination,
      },
    });
  }

  src ({read, since, base} = {read: true}) {
    const options = {read, since, base};

    if (since && typeof since === 'string') {
      options.since = gulp.lastRun(since);
    }

    return this._glob.src(options);
  }

  list () {
    return this._glob.list();
  }

  stream (options) {
    let stream = this._glob.src(options);

    if (this._pipe) {
      stream = this._pipe.through(stream);
    }

    return stream;
  }

  dest (options) {
    let stream = this._glob.src(options);

    if (this._pipe) {
      stream = this._pipe.through(stream);
    }

    if (this._destination) {
      return this._destination.dest(stream, {
        glob: this.glob, cwd: this.cwd, base: this.base,
      });
    }
  }
}
