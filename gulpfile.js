var gulp = require('gulp');
var browserSync = require('browser-sync') ;
var nodemon = require('gulp-nodemon');
var nodeHost = require('./ipConfig').nodeservers;
var reload = browserSync.reload;
var files = [ 
    './*.js',
    './views/*.html',
    './views/**/*.html',
    './routes/**/*.js'
    // 'views/**/*.html'
];

gulp.task('node',function( ){
     //node进程重启   
     nodemon({
         script:'./bin/www',
         ext:'js',
         watch:'./routes',
         runOnChangeOnly:true,
         env:{
             'NODE_ENV':'development'
         }


     }).on('start',reload,function(){
        console.log('start')
    });
    //浏览器刷新
    browserSync.init({
        proxy:nodeHost.ip+":"+nodeHost.port,
        files: files,
        browser:'chrome',
        notify:false,
        port:4001  //这个是browsersync 对 http://localhost:3333实现的代理端口
    });
   
})
 
//gulp4 新增series 串行 并行parallel
gulp.task('default',gulp.series('node'));  

