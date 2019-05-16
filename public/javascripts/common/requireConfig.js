require.config({
    baseUrl:'/javascripts',
    paths:{
        'jquery':'common/jquery',
        'bootstrap':'common/bootstrap',
        'popper':'common/popper',
        'editor':'lib/ckeditor/ckeditor',
        'index':'index'
    },
    shim: {
           'jquery': {
                    exports: '$'
                      },
　　　　　　'bootstrap':{
    　　　　　　　　deps: ['jquery','popper'],
                  exports: '$'
　　　　　　         },
     }
})