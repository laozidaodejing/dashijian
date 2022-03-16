$(function() {

    // 点击登录按钮
    $('#link_reg').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
        getCode()
    });
    // 点击注册按钮
    $('#link_login').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });
    // 验证码区域
    var codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    // 用来生成随机整数
    function getRandom(n, m) { // param: (Number, Number)
        n = Number(n);
        m = Number(m);
        // 确保 m 始终大于 n
        if (n > m) {
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.floor(Math.random() * (m - n) + n);
    }
    // 将随机生成的整数下标对应的字母放入div中
    function getCode() {
        var str = '';
        // 验证码有几位就循环几次
        for (var i = 0; i < 6; i++) {
            var ran = getRandom(0, 62);
            str += codeStr.charAt(ran);
        }
        $('#right_code').html(str);
    }
    getCode(); // 调用函数，页面刷新也会刷新验证码
    // 点击刷新验证码
    $('#right_code').on('click', function() {
        getCode();
    })

    // 自定义校验规则
    // 从layui获取form
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify()函数自定义规则
    form.verify({
            // 用户名规则
            username: function(value) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
            },
            // 密码位数规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 密码确认规则
            repwd: function(value) {
                var passval = $('.reg-box [name=password]').val()
                if (passval !== value) {
                    return '两次密码不一致' + passval;
                }
            }
        })
        // 注册接口
    $('#form_reg').on('submit', function(e) {
            // 阻止表单默认事件
            e.preventDefault()
                // 发起ajax的post请求
            $.post('/api/reguser', {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val()
                },
                function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('注册成功！请登录 ');
                    // 模拟人的点击行为
                    $('#link_reg').click()
                    getCode()
                })
        })
        // 登录接口
    $('#form_login').on('submit', function(e) {
        // 阻止表单默认事件
        e.preventDefault()
            // 发起ajax的post请求
        $.ajax({
            url: '/api/login',
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登陆失败")
                }
                layer.msg(res.message)
                    // console.log(res.token);
                    // 将得到的token保存在localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转到主页
                location.href = "/大事件项目课程资料/day1（1-3小节）/code/index.html"
            }
        })
    })
})