require.config({
    paths: {
        SockJS: 'lib/sockjs/sockjs',
        'event-emitter': 'lib/event-emitter/src/event-emitter',
        jquery: 'lib/jquery/dist/jquery',
        extend: 'lib/util-extend/extend',
        sinon: 'lib/sinonjs/sinon',
        chai: 'node_modules/chai/chai',
        debug: 'lib/debug/debug',
        inherits: 'lib/inherits/inherits',
        'stream-transform': 'src/index'
    },
    packages: [{
        name: 'stream',
        location: 'lib/stream/src'
    }],
    shim: {
        SockJS: {
            exports: 'SockJS'
        },
        sinon: {
          exports: 'sinon'
        }
    }
});
