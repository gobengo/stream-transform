'use strict'

var Duplex = require('stream').Duplex;
var Transform = require('stream').Transform;
var ReadableArray = require('stream-arrays').ReadableArray;

/**
 * stream-transform
 * var transform = require('stream-transform');
 * @param _transform {function|stream}
 *   Function to use as ._transform
 *   Or a stream you want to wrap to have a .map property
 * @example
 * source.pipe(transform(function (x, done) {
 *   this.push(String(x), String(x));
 *   done();  
 * })).pipe(dest);
 */
var transform = module.exports = function (_transform) {
    /*
    The general strategy is to
    * ensure source is a Readable. If it was an array, convert to ReadableArray
    * pipe the source though the Transform we return which records the history
    * once the source has ended, we change _read to transform the history
    */
    var history = [];
    var index = 0;
    var endedError = new Error('There are no next items in the set to transform');
    var source;

    if (_transform && _transform.readable) {
        source = _transform
    }

    if (typeof _transform !== 'function') {
        _transform = function (x, done) { done(null, x); }
    }

    if (Transform.prototype.write.length === 3) {
        var ogTransform = _transform;
        _transform = function nodeToObject(chunk, encoding, cb) {
            ogTransform(chunk, cb);
        }
    }

    var transformer = new Transform({
        objectMode: true,
        highWaterMark: 1,
        lowWaterMark: 1
    });
    // record what flows through transform
    transformer._transform = _transform;

    ['map', 'filter'].forEach(function (operator) {
        transformer[operator] = function (fn) {
            var wrapped = transform[operator](fn);
            transformer.pipe(wrapped);
            return wrapped;
        }
    });

    return transformer;
};

/**
 * Shortcut for synchronous transforms that only need to produce
 * one output per input
 */
transform.map = function (syncTransform) {
    return transform(function (x, done) {
        done(null, syncTransform(x));
    });
};

/**
 * Create a Filter stream that omits values that
 * are falsy after the applied syncFilter
 */
transform.filter = function (syncFilter) {
    return transform(function (x, done) {
        if (syncFilter(x)) {
            return done(null, x);
        }
        // falsy filtered, skip
        done();
    });
};


