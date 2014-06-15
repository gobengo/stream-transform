"use strict";

var transform = require('stream-transform');
var ReadableArray = require('stream/contrib/readable-array');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('stream-transform', function () {
  it('streams repeatedly the elements of a passed array', function (done) {
    var things = [1,2,3,4];
    var thingsStream = new ReadableArray(things);
    var increment = function (x, done) {
      done(x + 1);
    };
    var transformedThingsStream = thingsStream.pipe(transform(increment));
    var transformedThings = thingsStream.map(increment);
    assertStreams(transformedThingsStream, transformedThings, done);
  });
  xit('streams another readable until it ends, then transforms', function (done) {
    var arrayToCycle = [1,'2',3,{}];
    var streamToCycle = new ReadableArray(arrayToCycle);
    var things = transform(streamToCycle);
    assertStreams(things, arrayToCycle, 20, done);
  });
  xit('transforms a piped readable', function (done) {
    var arrayToCycle = [1,'2',3,{}];
    var streamToCycle = new ReadableArray(arrayToCycle);
    var things = transform();
    streamToCycle.pipe(things);
    assertStreams(things, arrayToCycle, 20, done);
  });
});

/**
 * Assert that the provided {readable} streams the provided array
 * Read from the readable {readsToTest} times.
 * Then call {done}
 */
function assertStreams(readable, thingsToCycle, readsToTest, done) {
  var readsTested = 0;
  readable.on('readable', function testOnReadable() {
    var thing = readable.read();
    assert.equal(thing, thingsToCycle[(readsTested % thingsToCycle.length)]);
    readsTested++;
    if (readsTested >= readsToTest) {
      readable.removeListener('readable', testOnReadable);
      done();
    }
  });
}
