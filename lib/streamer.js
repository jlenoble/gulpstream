'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeOptions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

var _gulpdest = require('gulpdest');

var _gulpdest2 = _interopRequireDefault(_gulpdest);

var _polypipe = require('polypipe');

var _polypipe2 = _interopRequireDefault(_polypipe);

var _argu = require('argu');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getMode = function getMode(arg) {
  if (typeof arg === 'string') {
    return arg;
  }

  if (arg && arg.mode) {
    return arg.mode;
  }

  return 'default';
};

var getGlobArg = function getGlobArg(arg) {
  if (arg instanceof _gulpglob.SimpleGulpGlob) {
    return arg;
  }

  if (arg && arg.glob) {
    return new (Function.prototype.bind.apply(_gulpglob2.default, [null].concat(_toConsumableArray((0, _argu.toArrayOfArrays)(arg.glob)))))();
  }
};

var getPipeArg = function getPipeArg(arg) {
  if (arg instanceof _polypipe.MonoPipe || arg instanceof _polypipe2.default.BasePolyton) {
    return arg;
  }

  if (arg && arg.pipe) {
    return new (Function.prototype.bind.apply(_polypipe2.default, [null].concat(_toConsumableArray((0, _argu.toArrayOfArrays)(arg.pipe)))))();
  }
};

var getDestArg = function getDestArg(arg) {
  if (arg instanceof _gulpdest.SimpleGulpDest) {
    return new _gulpdest2.default(arg);
  }

  if (arg && arg.dest !== undefined && typeof arg.dest !== 'function') {
    return new _gulpdest2.default(arg.dest);
  }
};

var makeOptions = exports.makeOptions = function makeOptions(args) {
  var globs = [];
  var pipes = [];
  var dest = void 0;
  var mode = void 0;

  args.forEach(function (arg) {
    var glb = getGlobArg(arg);
    var pipe = getPipeArg(arg);

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
    glob: new (Function.prototype.bind.apply(_gulpglob2.default, [null].concat(globs)))(),
    pipe: pipes.length ? new (Function.prototype.bind.apply(_polypipe2.default, [null].concat(pipes)))() : undefined,
    dest: dest, mode: mode
  };
};

var Streamer = function () {
  function Streamer() {
    _classCallCheck(this, Streamer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _makeOptions = makeOptions(args),
        glob = _makeOptions.glob,
        pipe = _makeOptions.pipe,
        dest = _makeOptions.dest,
        mode = _makeOptions.mode;

    Object.defineProperties(this, {
      _glob: {
        value: glob
      },

      _pipe: {
        value: pipe
      },

      _destination: {
        value: dest
      },

      mode: {
        value: mode
      },

      cwd: {
        value: glob && glob.cwd
      },

      base: {
        value: glob && glob.base
      },

      paths: {
        value: glob && glob.paths
      },

      glob: {
        value: glob && glob.glob
      },

      plugin: {
        value: pipe && pipe.plugin.bind(pipe)
      },

      destination: {
        value: dest && dest.destination
      }
    });
  }

  _createClass(Streamer, [{
    key: 'src',
    value: function src() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { read: true },
          read = _ref.read,
          since = _ref.since;

      var options = { read: read, since: since };

      if (since && typeof since === 'string') {
        options.since = gulp.lastRun(since);
      }

      return this._glob.src(options);
    }
  }, {
    key: 'list',
    value: function list() {
      return this._glob.list();
    }
  }, {
    key: 'stream',
    value: function stream(options) {
      var stream = this._glob.src(options);

      if (this._pipe) {
        stream = this._pipe.through(stream);
      }

      return stream;
    }
  }, {
    key: 'dest',
    value: function dest(options) {
      var stream = this._glob.src(options);

      if (this._pipe) {
        stream = this._pipe.through(stream);
      }

      if (this._destination) {
        return this._destination.dest(stream, {
          glob: this.glob, cwd: this.cwd, base: this.base
        });
      }
    }
  }]);

  return Streamer;
}();

exports.default = Streamer;