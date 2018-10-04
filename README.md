# gulpstream

Modular Gulp

  * [Purpose](#purpose)
  * [Creating](#creating)
  * [Mode](#mode)
  * [License](#license)


## Purpose

`GulpStream` encapsulates [`GulpGlob`](https://www.npmjs.com/package/gulpglob), [`PolyPipe`](https://www.npmjs.com/package/polypipe) and [`GulpDest`](https://www.npmjs.com/package/gulpdest).

It is used to create/recall any such triplet in a unique manner as `Streamer`, thus making it easy to create and recycle common `Gulp` pipelines.

## Creating

The `GulpStream` constructor expects to receive special arrays, one per [mode](#mode).

Each array is preprocessed to extract relevant information to infer the `mode` name and to construct the `GulpGlob`, `GulpDest` and `PolyPipe` objects.

* `mode`: Using the first string element or `'default'`.
* `glob`: Merging all `GulpGlob`'s, `SimpleGulpGlob`'s and `{glob}` elements, `glob` being a string or an array of strings as valid file paths or patterns.
* `dest`: One per mode, either a `GulpDest`, a `SimpleGulpDest` or `{dest}`. The first mode to have one defined imposes its dest to all modes that have none.
* `pipe`: Merging all `PolyPipe`'s, `MonoPipe`'s and `{pipe}` elements in sequence, `pipe` being an array of arrays of `gulp` plugins and their arguments, as in `[[newer, 'tmp'], [babel], [debug]]`. Shorthands will work when there are no arguments for plugins: `babel` or `[babel]` or `[[babel]]` will all work, as well as `[babel, debug]`. But `[newer, 'tmp']` won't. It must be `[[newer, 'tmp']]`.

```js
import GulpStream from 'gulpstream';
import GulpGlob from 'gulpglob';
import GulpDest from 'gulpdest';
import PolyPipe from 'polypipe';
import babel from 'gulp-babel';

const glob = 'src/*.js';
const dest = 'build';
const pipe = [babel];

const g1 = new GulpStream(
  [{glob, dest}],
  ['transpile', {glob, dest, pipe}]
);
```

## Mode

As a [Polyton](https://www.npmjs.com/package/polyton), a `GulpStream` actually
encapsulates several `Streamer`'s. This allows to switch dynamically between pipelines and dests while keeping the same source.

Passing a string as one of the `Streamer` initial arguments is understood to be a `mode` name.

Method `setMode(mode)` allows to change `mode`. Mode is changed implicitly is you pass `{mode}` to one of `src(options)`, `stream(options)` or `dest(options)`.

## License

gulpstream is [MIT licensed](./LICENSE).

© 2016-2018 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
