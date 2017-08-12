import glob from 'glob';
import path from 'path';
import gulp from 'gulp';
import {Transform} from 'stream';
import {expect} from 'chai';

export function validGlobs () {
  return [
    'src/streamer.js',
    '*.none',
    ['package.json'],
    ['gulpfile.babel.js', 'test/**/*.js'],
    ['gulp/**/*.js', 'test/**/*.js'],
    path.join(process.cwd(), 'package.json'),
    ['gulp/**/*.js', 'src/**/*.js', 'test/**/*.js', '*'],
  ];
};

export const pipeTestGlobs = [
  'gulpfile.babel.js',
  'test/**/*.js',
  [
    'gulpfile.babel.js',
    'test/**/*.js',
    'gulp/*.js',
    // '!gulp/globs.js',
  ],
];

export function validDest (_dest) {
  const dest = path.isAbsolute(_dest) ? _dest : path.join(process.cwd(), _dest);
  return validGlobs().map(glb => Array.isArray(glb) ?
    glb.map(g => path.join(dest, path.relative(process.cwd(), g))) :
    [path.join(dest, path.relative(process.cwd(), glb))]);
}

export function validDests () {
  return [
    'tmp',
    'build1',
    path.join(process.cwd(), 'build2'),
    '/tmp/gulpdest-' + (new Date()).getTime(),
  ];
};

export function invalidGlobs () {
  return [
    '',
    [],
    ['gulpfile.babel.js', ''],
    {},
    42,
  ];
};

export const invalidDests = invalidGlobs;

export function fileList (glb) {
  let glbs = Array.isArray(glb) ? glb : [glb];

  return Promise.all(glbs.map(glb => new Promise((resolve, reject) => {
    glob(glb, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const _files = files.map(file => {
        return !path.isAbsolute(file) ? path.join(process.cwd(), file) : file;
      });
      resolve(_files);
    });
  }))).then(files => files.reduce((arr1, arr2) => arr1.concat(arr2)));
};

export function fileSrc (glb) {
  return gulp.src(glb);
}

export function equalLists (list1, list2) {
  return list1.then(l => {
    return expect(list2).to.have.eventually.members(l);
  }).catch(err => {
    throw new Error(err);
  });
};

const DestroyableTransform = gulp.src('*.notfound').constructor;

export function isStream (stream) {
  return stream instanceof DestroyableTransform ||
    stream instanceof Transform;
};
