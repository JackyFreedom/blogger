require.config({
    baseUrl: '/public/javascripts',
    paths: {
        'jquery': 'common/jquery',
        'bootstrap': 'common/bootstrap',
        'aes': 'common/aesencrypt',
        'aesFn': 'common/aes-min',
        'popper': 'common/popper',
        'colpick': 'common/colpick',
        'socket': 'common/socket',
        'editor': 'lib/ckeditor/ckeditor',
        'index': 'index',
        
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery', 'popper'],
            exports: '$'
        },
        'colpick': {
            deps: ['jquery'],
            exports: '$'
        }

    }
})