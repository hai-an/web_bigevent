$( function ()
{
    // 点击 去注册
    $( '#link_reg' ).click( function ()
    {
        $( '.login-box' ).hide()
        $( '.reg-box' ).show()
    } )
    // 去登录链接 登录隐藏,注册显示
    $( '#link_login' ).click( function ()
    {
        $( '.login-box' ).show()
        $( '.reg-box' ).hide()

    } )

    // 1.导入内置模块
    const form = layui.form
    // 导入 内置模块 layer
    const layer = layui.layer
    // 2.自定义校验规则
    form.verify( {
        pwd: [ /^[\S]{6,12}$/, '密码需6到12位,且不能出现空格' ],
        repwd: function ( value )
        {
            // 把 形参 的传过来的值 是 了password的文本值
            // 然后把 pwd 和 value  相比判断是否能等
            // 不相等提示错误信息,否则
            let pwd = $( '.reg-box [name=password]' ).val()
            if ( value !== pwd )
            {
                return '两次密码不一致.'
            }
        }

    } )

    // 监听 form注册 提交 的功能
    $( '#form_reg' ).on( 'submit', function ( e )
    {
        e.preventDefault();
        $.ajax( {
            method: "post",
            url: "http://www.liulongbin.top:3007/api/reguser",
            data: { username: $( '#form_reg [name=username]' ).val(), password: $( '#form_reg [name=password]' ).val() },
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    // 修改 提示样式1
                    return layer.msg( res.message, { icon: 2 } )
                }
                // 修改 提示样式2
                layer.msg( '注册成功!', { icon: 1 } );
                // 最后模拟点击事件 => 登录界面
                $( '#link_login' ).click()
            }
        } );
    } );

    // 监听 form登录功能
    $( '#form-login' ).submit( function ( e )
    {
        e.preventDefault();
        // 发起ajaxqingq
        $.ajax( {
            method: 'post',
            url: "api/login",
            // 通过form,seri
            data: $( this ).serialize(),
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( res.message )
                }
                // 前提,获取 token 存到本地确认用户身份
                console.log( '登录成功' );
                console.log( res.token );
                // 将获取到的 token 存到本地储存通过键值对形式
                localStorage.setItem( 'token', res.token )

                // 成功后跳转到主页面
                location.href = '/index.html';
            }
        } );

    } );
} )
