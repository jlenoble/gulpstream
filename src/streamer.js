import GulpGlob, {SimpleGulpGlob} from 'gulpglob';
import GulpDest, {SimpleGulpDest} from 'gulpdest';
import {toArrayOfArrays} from 'argu';

const getGlobArg = arg => {
  if (arg instanceof SimpleGulpGlob) {
    return arg;
  }

  if (arg.glob) {
    return new GulpGlob(...toArrayOfArrays(arg.glob));
  }
};

const getDestArg = arg => {
  if (arg instanceof SimpleGulpDest) {
    return new GulpDest(arg);
  }

  if (arg.dest && typeof arg.dest !== 'function') {
    return new GulpDest(arg.dest);
  }
};

const makeOptions = args => {
  const globs = [];
  let dest;

  args.forEach(arg => {
    const glb = getGlobArg(arg);

    if (glb) {
      globs.push(glb);
    }

    if (!dest) {
      dest = getDestArg(arg);
    }
  });

  return {
    glob: new GulpGlob(...globs),
    dest,
  };
};

export default class Streamer {
  constructor (...args) {
    const {glob, dest} = makeOptions(args);

    Object.defineProperties(this, {
      _glob: {
        value: glob,
      },

      _destination: {
        value: dest,
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

      destination: {
        value: dest && dest.destination,
      },
    });
  }

  src () {
    return this._glob.src();
  }

  list () {
    return this._glob.list();
  }

  dest () {
    let stream = this._glob.src();

    if (this._pipe) {
      stream = this._pipe.stream(stream);
    }

    return this._destination.dest(stream, {
      glob: this.glob, cwd: this.cwd, base: this.base,
    });
  }
}
