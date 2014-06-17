# stream-transform

Create a [stream](https://github.com/Livefyre/stream)/Transform by providing an asynchronous function to map over the stream.

## Example

From [the tests](./test/spec/):

```javascript
function increment = function (x) { return x + 1; };
function not = function (notValue) {
    return function (value) {
        return value != notValue;
    }
};
function incrementAsync = function (x, done) { done(null, increment(x)); };
cycle([1,2,3])
  .pipe(transform(incrementAsync)
  .pipe(transform.filter(not(2))
  .pipe(transform.map(String))
  .forEach(console.log);
// '3'
// '2'
// '3'
// '2'
// '3'
// '2'
```

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
