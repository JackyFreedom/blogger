define(['jquery','bootstrap'],function($,strap){
    $('.carousel').carousel({
        interval: 2000
    })

    var nodeHost = $('#nodeHost').val() || '';
    console.log('node--', nodeHost)
    //注册
    var $register = $('#register');
    $register.find('#registerSubmit').on('click', function () {
        console.log('ajax', nodeHost)
        $.ajax({
            type: 'post',
            url: nodeHost + '/users/register',
            data: {
                userName: $.trim($register.find('input[name=userName]').val()) ||
                    '',
                password: $.trim($register.find('input[name=password]').val()) ||
                    '',
                repetition: $.trim($register.find('input[name=repetition]')
                .val()) || ''
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
                password: $.trim($login.find('input[name=password]').val()) || ''
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
}
})