# stream-transform

![](http://media.giphy.com/media/9j1JaFT9Mbl3G/giphy.gif)

Create a [stream](https://github.com/Livefyre/stream)/Transform by providing an asynchronous function to map over the stream.

## Example

```javascript
var alternating = cycle([1,0]);
var alternatingIncremented = alternating.pipe(transform(function (x, done) {
    done(x+1);
}));
alternatingIncremented.on('data', console.log);
// 2
// 1
// 2
// 1
// 2
// 1
```

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
