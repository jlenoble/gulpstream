import testGulpProcess, {nextTask, snapshot, isUntouched, isSameContent,
  isNewer, isChangedContent} from 'test-gulp-process';

describe('Testing GulpStream API', function () {
  const buildTestGlob = 'build/test/**/*.js';

  it(`Sourcing`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/sourcing.js',
    task: ['default', 'newer', 'default'],

    messages: [
      `Starting 'default'...`,
      [`Finished 'default' after`,
        nextTask()],
      `Starting 'newer'...`,
      [`Finished 'newer' after`,
        nextTask()],
      `Starting 'default'...`,
      `Finished 'default' after`,
    ],
  }));

  it(`Desting`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/desting.js',
    task: ['default', 'newer', 'babel'],

    messages: [
      `Starting 'default'...`,
      [`Finished 'default' after`,
        snapshot(buildTestGlob),
        nextTask()],
      `Starting 'newer'...`,
      [`Finished 'newer' after`,
        isUntouched(buildTestGlob),
        isSameContent(buildTestGlob),
        nextTask(),
      ],
      `Starting 'babel'...`,
      [`Finished 'babel' after`,
        isNewer(buildTestGlob),
        isChangedContent(buildTestGlob)],
    ],
  }));
});
