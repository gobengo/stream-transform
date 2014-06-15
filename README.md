# stream-transform

![](http://media.giphy.com/media/9j1JaFT9Mbl3G/giphy.gif)

Create a [stream](https://github.com/Livefyre/stream)/Transform by providing an asynchronous function to map over the stream.

## Example

```javascript
var alternating = cycle([1,0]);
function increment = function (x) { return x + 1; };
function incrementAsync = function (x, done) { done(null, increment(x)); };
cycle([1,0])
  .pipe(transform(incrementAsync)
  .pipe(transform.map(increment)
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
