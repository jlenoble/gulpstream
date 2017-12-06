'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeOptions = exports.Streamer = undefined;

var _properties;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _streamer2 = require('./streamer');

var _streamer3 = _interopRequireDefault(_streamer2);

var _polyton = require('polyton');

var _polypipe = require('polypipe');

var _polypipe2 = _interopRequireDefault(_polypipe);

var _gulpUtil = require('gulp-util');

var _keyfunc = require('keyfunc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var uneq = (0, _keyfunc.unequiv)({
  type: 'array',
  sub: ['ignore', {
    type: 'object',
    ntimes: 3
  }]
});

var emptyDest = {};

var _mode = Symbol();
var _streamer = Symbol();
var _streamers = Symbol();

var GulpStream = (0, _polyton.PolytonFactory)( // eslint-disable-line new-cap
_streamer3.default, ['literal', 'object', {
  type: 'object',
  optional: true
}, {
  type: 'object',
  optional: true
}], ['unique', 'unordered'], {
  preprocess: function preprocess(args) {
    var _glob = void 0;
    var _pipe = void 0;
    var _dest = void 0;

    var modes = {};

    var _args = args.map(function (_args) {
      var _makeOptions = (0, _streamer2.makeOptions)(_args),
          glob = _makeOptions.glob,
          pipe = _makeOptions.pipe,
          dest = _makeOptions.dest,
          mode = _makeOptions.mode;

      if (glob) {
        if (!_glob) {
          _glob = glob;
        } else if (glob !== _glob) {
          throw new Error('Glob mismatch: ' + JSON.stringify(glob.glob) + ' != ' + JSON.stringify(_glob.glob));
        }
      }

      if (pipe && !_pipe) {
        _pipe = pipe;
      }

      if (!_pipe) {
        _pipe = new _polypipe2.default([_gulpUtil.noop]);
      }

      if (dest && !_dest) {
        _dest = dest;
      }

      if (!_dest) {
        _dest = emptyDest;
      }

      if (modes[mode]) {
        throw new Error('Mode already set: \'' + mode + '\'');
      }

      modes[mode] = true;

      return [mode, glob, pipe, dest];
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 4),
          mode = _ref2[0],
          glob = _ref2[1],
          pipe = _ref2[2],
          dest = _ref2[3];

      return [mode, glob || _glob, pipe || _pipe, dest || _dest];
    });

    if (!modes['default']) {
      throw new Error('No \'default\' mode set');
    }

    if (!uneq.apply(undefined, _toConsumableArray(_args))) {
      throw new Error('Init Streamer args cannot only differ by \'mode\'');
    }

    return _args;
  },


  properties: (_properties = {}, _defineProperty(_properties, _mode, {
    value: 'default',
    writable: true
  }), _defineProperty(_properties, _streamer, {
    value: null,
    writable: true
  }), _defineProperty(_properties, _streamers, {
    value: {}
  }), _defineProperty(_properties, 'mode', {
    get: function get() {
      return this[_mode];
    }
  }), _defineProperty(_properties, 'streamer', {
    get: function get() {
      return this[_streamer];
    }
  }), _defineProperty(_properties, 'cwd', {
    get: function get() {
      return this[_streamer].cwd;
    }
  }), _defineProperty(_properties, 'base', {
    get: function get() {
      return this[_streamer].base;
    }
  }), _defineProperty(_properties, 'paths', {
    get: function get() {
      return this[_streamer].paths;
    }
  }), _defineProperty(_properties, 'glob', {
    get: function get() {
      return this[_streamer].glob;
    }
  }), _defineProperty(_properties, 'plugin', {
    get: function get() {
      return this[_streamer].plugin;
    }
  }), _defineProperty(_properties, 'destination', {
    get: function get() {
      return this[_streamer].destination;
    }
  }), _properties),

  postprocess: function postprocess(instance, args) {
    instance.forEach(function (p) {
      instance[_streamers][p.mode] = p; // eslint-disable-line no-param-reassign, max-len
    });
    instance[_streamer] = instance[_streamers][instance[_mode]]; // eslint-disable-line no-param-reassign, max-len
    return instance;
  },


  extend: {
    setMode: function setMode(mode) {
      if (typeof mode === 'string') {
        var strm = this[_streamers][mode];

        if (strm) {
          this[_mode] = mode;
          this[_streamer] = strm;
        } else {
          throw new Error('Mode ' + mode + ' is undefined');
        }
      } else {
        throw new TypeError('Mode must be set with a string');
      }
    },
    src: function src() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { read: true, mode: 'default' };

      this.setMode(options.mode);
      return this[_streamer].src(options);
    },
    list: function list() {
      this.setMode('default');
      return this[_streamer].list();
    },
    stream: function stream() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { read: true, mode: 'default' };

      this.setMode(options.mode);
      return this[_streamer].stream(options);
    },
    dest: function dest() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { read: true, mode: 'default' };

      this.setMode(options.mode);
      return this[_streamer].dest(options);
    }
  }
});

exports.default = GulpStream;
exports.Streamer = _streamer3.default;
exports.makeOptions = _streamer2.makeOptions;