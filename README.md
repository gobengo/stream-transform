# stream-cycle

![](http://media.giphy.com/media/9j1JaFT9Mbl3G/giphy.gif)

Create a [stream](https://github.com/Livefyre/stream)/Readable that infinitely cycles over the items in an array or another, finite Readable. A lot like Python's [itertools.cycle](https://docs.python.org/2/library/itertools.html#itertools.cycle)

One use case for this is to produce an infinite stream from an Array of mock objects so you can test downstream Writables.

## Example

```javascript
var alternating = cycle([1,0]);
alternating.on('data', console.log);
// 1
// 0
// 1
// 0
// 1
// 0
```

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
