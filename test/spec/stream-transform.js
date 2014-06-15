"use strict";

var transform = require('stream-transform');
var ReadableArray = require('stream-arrays').ReadableArray;
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

  it('returned stream has .filter()', function (done) {
    var things = [1,2,3,4];
    var thingsStream = new ReadableArray(things);
    var transformedThingsStream = thingsStream
      .pipe(transform(thingsStream))
      .filter(Boolean)
    var transformedThings = things
      .filter(Boolean)
    assertStreams(transformedThingsStream, transformedThings, done);
  });

  it('can combine operators', function (done) {
    var numberStrings = new ReadableArray([1,2,3])
      .pipe(transform.filter(not(2)))
      .pipe(transform(incrementAsync))
      .pipe(transform.map(String))

      numberStrings.on('end', function () {
        done();
      });

      numberStrings.on('data', function (d) {
        // these are valid outputs of this pipeline
        assert.notEqual(['2', '4'].indexOf(d), -1);
      });

    function not(notValue) {
        return function (value) {
            return value != notValue;
        };
    }
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

  describe('.filter', function () {
    it('maps a synchronous transformation function like Array.prototype.filter', function (done) {
      var things = [1,2,0,3,4, 0, 1];
      var thingsStream = new ReadableArray(things);

      assert.typeOf(transform.filter, 'function');
      var filteredStream = thingsStream.pipe(transform.filter(Boolean));
      var filtered = things.filter(Boolean);
      var ogWrite = filteredStream.write;
      filteredStream.write = function (x) {
        return ogWrite.apply(this, arguments);
      }
      assertStreams(filteredStream, filtered, done);
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
  readable.on('end', function () {
    assert.equal(readsTested, thingsToCycle.length, 'read all vlues');
    done();
  });
}

function increment(x) {
  return x + 1;
}

function incrementAsync(x, done) {
  done(null, x + 1);
};
