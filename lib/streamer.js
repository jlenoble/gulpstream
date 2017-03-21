'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

var _polypipe = require('polypipe');

var _polypipe2 = _interopRequireDefault(_polypipe);

var _gulpdest = require('gulpdest');

var _gulpdest2 = _interopRequireDefault(_gulpdest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var preprocess = function preprocess(arg) {
  return Array.isArray(arg) ? arg : [arg];
};

var Streamer = function () {
  function Streamer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Streamer);

    var glob = options.glob,
        pipe = options.pipe,
        dest = options.dest;


    var _glob = new _gulpglob2.default(glob);
    var _pipe = pipe !== undefined ? new (Function.prototype.bind.apply(_polypipe2.default, [null].concat(_toConsumableArray(preprocess(pipe)))))() : null;
    var _dest = dest !== undefined ? new (Function.prototype.bind.apply(_gulpdest2.default, [null].concat(_toConsumableArray(preprocess(dest)))))() : null;

    Object.defineProperties(this, {
      _glob: {
        get: function get() {
          return _glob;
        }
      },
      _pipe: {
        get: function get() {
          return _pipe;
        }
      },
      _destination: {
        get: function get() {
          return _dest;
        }
      },
      glob: {
        get: function get() {
          return _glob.glob;
        }
      },
      plugin: {
        get: function get() {
          return _pipe.plugin.bind(_pipe);
        }
      },
      destination: {
        get: function get() {
          return _dest.destination;
        }
      }
    });
  }

  _createClass(Streamer, [{
    key: 'src',
    value: function src() {
      return this._glob.src();
    }
  }, {
    key: 'list',
    value: function list() {
      return this._glob.list();
    }
  }, {
    key: 'stream',
    value: function stream() {
      var stream = this._glob.src();

      if (this._pipe) {
        stream = this._pipe.through(stream);
      }

      return stream;
    }
  }, {
    key: 'plugin',
    value: function plugin() {
      var stream = this._glob.src();

      if (this._pipe) {
        stream = this._pipe.through(stream);
      }

      return stream;
    }
  }, {
    key: 'dest',
    value: function dest() {
      var stream = this._glob.src();

      if (this._pipe) {
        stream = this._pipe.stream(stream);
      }

      return this._destination.dest(stream, this.glob);
    }
  }]);

  return Streamer;
}();

exports.default = Streamer;
module.exports = exports['default'];