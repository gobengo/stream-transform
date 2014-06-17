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
        'stream-transform': 'src/index',
        events: 'node_modules/stream-arrays/node_modules/stream-objectmode/node_modules/events/events',
        'util-extend': 'node_modules/stream-arrays/node_modules/stream-objectmode/node_modules/util-extend/extend',
    },
    map: {
        '*': {
            'stream': 'stream-objectmode'
        }
    },
    packages: [{
        name: 'stream-arrays',
        location: 'node_modules/stream-arrays',
        main: 'index'
    },{
        name: 'stream-objectmode',
        location: 'node_modules/stream-arrays/node_modules/stream-objectmode/src',
        main: 'main'
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
