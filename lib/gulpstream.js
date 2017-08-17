'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Streamer = undefined;

var _streamer = require('./streamer');

var _streamer2 = _interopRequireDefault(_streamer);

var _polyton = require('polyton');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GulpStream = (0, _polyton.PolytonFactory)( // eslint-disable-line new-cap
_streamer2.default, ['object', {
  type: 'object',
  optional: true
}, {
  type: 'object',
  optional: true
}], 'unique', {
  preprocess: function preprocess(args) {
    var _args = args.map(function (_args) {
      var _makeOptions = (0, _streamer.makeOptions)(_args),
          glob = _makeOptions.glob,
          pipe = _makeOptions.pipe,
          dest = _makeOptions.dest;

      return [glob, pipe, dest];
    });

    return _args;
  }
});

exports.default = GulpStream;
exports.Streamer = _streamer2.default;