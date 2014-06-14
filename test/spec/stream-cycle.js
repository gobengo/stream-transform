"use strict";

var cycle = require('stream-cycle');
var ReadableArray = require('stream/contrib/readable-array');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('stream-cycle', function () {
  it('streams repeatedly the elements of a passed array', function (done) {
    var arrayToCycle = [1,2,3,4,'7',{},6];
    var things = cycle(arrayToCycle);
    assertCycles(things, arrayToCycle, 20, done);
  });
  it('streams another readable until it ends, then cycles', function (done) {
    var arrayToCycle = [1,'2',3,{}];
    var streamToCycle = new ReadableArray(arrayToCycle);
    var things = cycle(streamToCycle);
    assertCycles(things, arrayToCycle, 20, done);
  });
  it('cycles a piped readable', function (done) {
    var arrayToCycle = [1,'2',3,{}];
    var streamToCycle = new ReadableArray(arrayToCycle);
    var things = cycle();
    streamToCycle.pipe(things);
    assertCycles(things, arrayToCycle, 20, done);
  });
});

/**
 * Assert that the provided {readable} cycles through the provided
 * {thingsToCycle}
 * Read from the readable {readsToTest} times.
 * Then call {done}
 */
function assertCycles(readable, thingsToCycle, readsToTest, done) {
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
