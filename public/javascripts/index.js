define(['jquery', 'bootstrap','aes'], function ($, strap,aes) {
    $('.carousel').carousel({
        interval: 2000
    })
    // console.log('--'+aes.encryptByAES('aaaaaaa')+'--')
    console.log('aes',aes.unEncryptByAES('s7s/ST9h/nbhB5EP4kSC3g=='))
    
    var nodeHost = $('#nodeHost').val() || '';
    console.log('node--', nodeHost)
    //注册
    var $register = $('#register');
    $register.find('#registerSubmit').on('click', function () {
        // console.log('ajax', nodeHost)
        $.ajax({
            type: 'post',
            url: nodeHost + '/users/register',
            data: {
                userName: $.trim($register.find('input[name=userName]').val()) ||
                    '',
                password:aes.encryptByAES( $.trim($register.find('input[name=password]').val()) ||
                    ''),
                repetition:aes.encryptByAES( $.trim($register.find('input[name=repetition]')
                    .val()) || '')
            },
            success: function (data) {
                //    console.log('data',data);
                if (data.code === 0) {
                    $register.find('[name=errorMessage]').removeClass(
                        'alert-danger alert-success');
                    $register.find('[name=errorMessage]').addClass(
                        'alert-success');
                    $register.find('[name=errorMessage]').show();
                    $register.find('[name=errorMessage]').text(data.message);
                    setTimeReload();
                } else {
                    $register.find('[name=errorMessage]').removeClass(
                        'alert-danger alert-success');
                    $register.find('[name=errorMessage]').addClass(
                        'alert-danger');
                    $register.find('[name=errorMessage]').show();
                    $register.find('[name=errorMessage]').text(data.message);
                }
            }
        })
    })


    //登陆

    var $login = $('#login');
    $login.find('#loginSubmit').on('click', function () {
        $.ajax({
            type: 'post',
            url: nodeHost + '/users/login',
            data: {
                userName: $.trim($login.find('input[name=userName]').val()) || '',
                password:aes.encryptByAES($.trim($login.find('input[name=password]').val() || '')) 
            },
            success: function (data) {
                //    console.log('data',data);
                if (data.code === 0) {
                    $login.find('[name=errorMessage]').removeClass(
                        'alert-danger alert-success');
                    $login.find('[name=errorMessage]').addClass(
                        'alert-success');
                    $login.find('[name=errorMessage]').show();
                    $login.find('[name=errorMessage]').text(data.message);
                    setTimeReload();
                } else {
                    $login.find('[name=errorMessage]').removeClass(
                        'alert-danger alert-success');
                    $login.find('[name=errorMessage]').addClass('alert-danger');
                    $login.find('[name=errorMessage]').show();
                    $login.find('[name=errorMessage]').text(data.message);
                }
            }
        })
    })

    //定时刷新
    function setTimeReload(second) {
        var second = second || 600;
        setTimeout(function () {
            window.location.reload();
        }, second)
    };



    (function ($) {
        //音频播放器
        var audioPathArray = $('.audioPaths').map(function (ind, val) {
            return $(val).val();
        }).toArray()
        // console.log('audioPathArray', audioPathArray);
        var audioNext = $(".audioNext");
        var audioSrcLen = audioPathArray.length - 1;
        var audioIndex = 0;
        //点下一首通过切换src来完成
        audioNext.on('click', function () {
            var at = $(this).attr('name');
            if (at == '上一首') {
                audioIndex = audioIndex > 0 ? audioIndex - 1 : 0;
                atAudioSrc()
            } else if (at == '下一首') {
                // console.log(audioSrcLen, 'index', audioIndex)
                audioIndex = audioIndex < audioSrcLen ? audioIndex + 1 : audioSrcLen;
                atAudioSrc()
            }
            // console.log('index', audioIndex)
        })
        function atAudioSrc() {
            // console.log('url', audioPathArray[audioIndex])
            $('#headAudio').attr('src', '/audio?id=' + audioPathArray[audioIndex])

        }

        //初始化
        atAudioSrc()
    }($));
    (function ($) {
        //雪花效果
        var minSize = 5;
        var maxSize = 50;
        var newOn = 100;//产生雪花的速度
        var flakeColor = "#fff";
        var flake = $("<div></div>").css({ "position": "absolute", "top": "-50px" }).html("❄");
        $(function () {
            var documentWidth = $(document).width();
            var documentHeight = $(document).height();

            setInterval(function () {
                var startPositionLeft = Math.random() * documentWidth;
                var startOpacity = 0.7 + Math.random() * 0.3;
                var endPositionTop = documentHeight;
                var endPostionLeft = Math.random() * documentWidth;
                var durationFall = 2000 + Math.random() * 3000;
                var sizeFlake = minSize + Math.random() * maxSize;
                flake.clone().appendTo("body").css({
                    "left": startPositionLeft,
                    "opacity": startOpacity,
                    "font-size": sizeFlake,
                    "color": flakeColor
                }).animate({
                    "top": endPositionTop,
                    "left": endPostionLeft,
                    "opacity": 0.5
                }, durationFall, function () { $(this).remove(); });
            }, newOn);
        });
    }($))
})