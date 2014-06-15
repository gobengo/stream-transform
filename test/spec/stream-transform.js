"use strict";

var transform = require('stream-transform');
var ReadableArray = require('stream/contrib/readable-array');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('stream-transform', function () {
  it('creates a stream/transform from just the _transform function', function (done) {
    var things = [1,2,3,4];
    var thingsStream = new ReadableArray(things);
    var transformedThingsStream = thingsStream.pipe(transform(incrementAsync));
    var transformedThings = things.map(increment);
    assertStreams(transformedThingsStream, transformedThings, done);
  });
  it('returned stream has .map()', function (done) {
    var things = [1,2,3,4];
    var thingsStream = new ReadableArray(things);
    var transformedThingsStream = thingsStream
      .pipe(transform(thingsStream))
      .map(increment)
      .map(String);
    var transformedThings = things
      .map(increment)
      .map(String);
    assertStreams(transformedThingsStream, transformedThings, done);
  });
  describe('.map', function () {
    it('maps a synchronous transformation function like Array.prototype.map', function (done) {
      var things = [1,2,3,4];
      var thingsStream = new ReadableArray(things);
      var transformedThingsStream = thingsStream.pipe(transform.map(increment));
      var transformedThings = things.map(increment);
      assertStreams(transformedThingsStream, transformedThings, done);
    });
  });
});

/**
 * Assert that the provided {readable} streams the provided array
 * Read from the readable {readsToTest} times.
 * Then call {done}
 */
function assertStreams(readable, thingsToCycle, done) {
  var readsTested = 0;
  readable.on('readable', function testOnReadable() {
    var thing = readable.read();
    assert.equal(thing, thingsToCycle[readsTested]);
    readsTested++;
  });
  readable.on('error', done);
  readable.on('end', done.bind({}, null));
}

function increment(x) {
  return x + 1;
}

function incrementAsync(x, done) {
  done(null, x + 1);
};
