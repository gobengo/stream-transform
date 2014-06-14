'use strict'

var Duplex = require('stream').Duplex;
var Transform = require('stream').Transform;
var ReadableArray = require('stream/contrib/readable-array');

/**
 * stream-cycle
 * var cycle = require('stream-cycle');
 * @param source {stream|array} Source to cycle
 * @example
 * from array
 *   cycle([1,2,3,4]).pipe(dest);
 * remember what is piped in and cycle once ended
 *   source.pipe(cycle()).pipe(dest);
 */
module.exports = function (source) {
    /*
    The general strategy is to
    * ensure source is a Readable. If it was an array, convert to ReadableArray
    * pipe the source though the Transform we return which records the history
    * once the source has ended, we change _read to cycle the history
    */
    var history = [];
    var index = 0;
    var endedError = new Error('There are no next items in the set to cycle');

    source = source || [];
    if (Array.isArray(source)) {
        source = new ReadableArray(source);
    }

    var cycle = new Transform({
        objectMode: true,
        highWaterMark: 1,
        lowWaterMark: 1
    });
    // record what flows through cycle
    cycle._transform = function (chunk, done) {
        history.push(chunk);
        done();
    };

    source.on('end', function () {
        source.unpipe(cycle);
        cycle._read = function () {
            setTimeout(function () {
                this.push(next());
            }.bind(this));
        }
        cycle.read(0);
    })

    // Initially, pipe the source through the cycle
    // But dont end when its done, because then we'll start
    // replaying the history 
    source.pipe(cycle, { end: false });

    // get the next thing from the history according to index
    // this cycles because modulo
    function next() {
        var nextThing = history[index % history.length];
        index++;
        return nextThing;
    }

    return cycle;
};
