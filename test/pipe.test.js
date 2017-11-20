import gulp from 'gulp';
import {pipeTestGlobs} from './helpers';
import {allArgs} from './pipe-helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Streamer is a class encapsulting streams', function () {
  this.timeout(4000); // eslint-disable-line no-invalid-this

  allArgs.forEach(args => {
    describe(`Using Streamer with pipe "${args.description}"`,
      function () {
        pipeTestGlobs.forEach(glb => {
          it(`And with glob "${glb}" as init arg`, function () {
            const streamer = args.instantiate(glb);
            const stream = streamer.stream();
            return equalStreamContents(stream, args.refStream(glb));
          });

          it(`Or as a straight plugin, sourcing "${glb}" with gulp`,
            function () {
              const streamer = args.instantiate('dummy.txt');
              const stream = gulp.src(glb).pipe(streamer.plugin());
              return equalStreamContents(stream, args.refStream(glb));
            });
        });
      });
  });
});
