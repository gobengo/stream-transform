'use strict'

var Duplex = require('stream-objectmode').Duplex;
var Transform = require('stream-objectmode').Transform;
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

/**
 * Compose many transforms
 * @param [...] {Transform|function} Args are the transforms you want to 
 * compose into one. pass as many as you like
 */
transform.compose = function (t1, t2) {
    var args = [].slice.call(arguments);
    var transforms = args
        .filter(function (t) {
            return typeof t !== 'number';
        })
        .map(ensureTransform);
    if ( ! transforms.length) {
        transforms = [transform(function (x, done) { done(null, x); } )];
    }
    var first = transforms[0];
    // pipe all the arguments together and keep the last
    // one
    var last = transforms
        // If passed a function, convert to Transform
        .map(ensureTransform)
        // Pipe all the streams, and catch errors on all of them
        .reduce(function (prev, stream) {
            stream.on('error', onError);
            if ( ! prev) {
                return stream;
            }
            return prev.pipe(stream);
        });
    var composed = transform(function (x, done) {
        first.write(x);

        var out = [];
        var nextOut;
        while (nextOut = last.read()) {
            out.push(nextOut);
        }
        if (out.length) {
            return done.apply(this, [null].concat(out));
        }
        last.once('readable', function () {
            var out = last.read();
            done(null, out);
        })
    });

    /**
     * Add another transform to the mix (at the end)
     * @param {number} Index to add (default -1)
     * @param {function|Transform...} another transforms to add to the mix
     */
    composed.use = function use(t) {
        // If a number is passed as arg, use that as the index to insert at
        // default to -1 (the end);
        var args = [].slice.call(arguments);
        var index = -1;
        var newTransforms = args.filter(function (t) {
            return typeof t !== 'number';
        });
        
        switch (newTransforms.length) {
            case 0:
              return;
            case 1:
              t = newTransforms[0];
              break;
            default:
              t = transform.compose.apply(transform, newTransforms);
        }
        
        t = ensureTransform(t);
        transforms.splice(index, 0, t);
        last.pipe(t);
        last = t;
        return this;
    };

    function onError(e) {
        composed.emit('error', e);
    }
    function ensureTransform(t) {
        if (typeof t === 'function') {
            return transform(t);
        }
        return t;
    }
    return composed;
} 
