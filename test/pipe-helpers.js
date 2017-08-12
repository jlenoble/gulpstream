import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import PolyPipe from 'polypipe';
import Streamer from '../src/streamer';

function refStream (glb) {
  let stream = gulp.src(glb);
  this.values.forEach(values => { // eslint-disable-line no-invalid-this
    const [fn, ...args] = Array.isArray(values) ? values : [values];
    stream = stream.pipe(fn(...args));
  });
  return stream;
}

function refStream2 (glb) {
  return gulp.src(glb).pipe(
    this.values[0].plugin()); // eslint-disable-line no-invalid-this
}

function refStream3 (glb) {
  let stream2 = gulp.src(glb);
  const pipes = this.values.reduce( // eslint-disable-line no-invalid-this
    (array, polypipe) => {
      return array.concat(polypipe.initArgs);
    }, []);
  pipes.forEach(values => {
    const [fn, ...args] = values;
    stream2 = stream2.pipe(fn(...args));
  });
  return stream2;
}

function instantiate (glob) {
  return new Streamer({
    glob,
    pipe: this.values, // eslint-disable-line no-invalid-this
  });
}

export const argsAsListsOfPlugins = [
  {
    description: 'noop',
    values: [noop],
  },
  {
    description: '[noop]',
    values: [[noop]],
  },
  {
    description: 'babel',
    values: [babel],
  },
  {
    description: `[rename, {suffix: '-renamed'}]`,
    values: [[rename, {suffix: '-renamed'}]],
  },
  {
    description: `noop, [rename, {suffix: '-renamed'}], [babel]`,
    values: [noop, [rename, {suffix: '-renamed'}], [babel]],
  },
];

argsAsListsOfPlugins.forEach(args => {
  Object.assign(args, {refStream, instantiate});
});

export const argsAsPolyPipes = [
  {
    description: 'new PolyPipe(noop)',
    values: [new PolyPipe(noop)],
  },
  {
    description: 'new PolyPipe(babel)',
    values: [new PolyPipe(babel)],
  },
  {
    description: 'new PolyPipe(noop, babel)',
    values: [new PolyPipe(noop, babel)],
  },
];

argsAsPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: refStream2,
    instantiate: instantiate,
  });
});

export const argsAsListsOfPolyPipes = [
  {
    description: 'new PolyPipe(noop), new PolyPipe(babel)',
    values: [new PolyPipe(noop), new PolyPipe(babel)],
  },
  {
    description: `
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])`,
    values: [
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      new PolyPipe(babel, [rename, {suffix: '-renamed-twice'}]),
    ],
  },
  {
    description: `
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
    with handwritten refStream as control`,
    values: [
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      new PolyPipe(babel, [rename, {suffix: '-renamed-twice'}]),
    ],
    refStream: function (glb) {
      return gulp.src(glb)
        .pipe(noop())
        .pipe(rename({suffix: '-renamed'}))
        .pipe(babel())
        .pipe(rename({suffix: '-renamed-twice'}));
    },
  },
];

argsAsListsOfPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: args.refStream || refStream3,
    instantiate: instantiate,
  });
});

export const argsAsMixedBags = [
  {
    description: `
      noop,
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      [rename, {suffix: '-renamed2'}]
      new PolyPipe(babel, [rename, {suffix: '-renamed3'}])
    with handwritten refStream`,
    values: [
      noop,
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      [rename, {suffix: '-renamed2'}],
      new PolyPipe(babel, [rename, {suffix: '-renamed3'}]),
    ],
    refStream: function (glb) {
      return gulp.src(glb)
        .pipe(noop())
        .pipe(noop())
        .pipe(rename({suffix: '-renamed'}))
        .pipe(rename({suffix: '-renamed2'}))
        .pipe(babel())
        .pipe(rename({suffix: '-renamed3'}));
    },
  },
];

argsAsMixedBags.forEach(args => {
  Object.assign(args, {instantiate});
});

export const allArgs = [argsAsListsOfPlugins, argsAsPolyPipes,
  argsAsListsOfPolyPipes, argsAsMixedBags].reduce(
  (array, next) => array.concat(next));
