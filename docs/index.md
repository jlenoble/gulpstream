## Purpose !heading

`GulpStream` encapsulates [`GulpGlob`](https://www.npmjs.com/package/gulpglob), [`PolyPipe`](https://www.npmjs.com/package/polypipe) and [`GulpDest`](https://www.npmjs.com/package/gulpdest).

It is used to create/recall any such triplet in a unique manner as `Streamer`, thus making it easy to create and recycle common `Gulp` pipelines.

## Example !heading

```js
import GulpStream from 'gulpstream';
import GulpGlob from 'gulpglob';
import GulpDest from 'gulpdest';
import PolyPipe from 'polypipe';
import babel from 'gulp-babel';

const glob = 'src/*.js';
const dest = 'build';
const pipe = [babel];

const g1 = new GulpStream([{glob, dest, pipe}]);
const g2 = new GulpStream([
  new GulpGlob(glob),
  new GulpDest(dest),
  new PolyPipe(pipe),
]);

g1 === g2; // true
```

## License !heading

gulpstream is [MIT licensed](./LICENSE).

© 1970-2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
