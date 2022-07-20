$( function ()
{
    const form = layui.form
    const layer = layui.layer
    form.verify( {
        nickname: function ( value )
        {
            if ( value.length > 6 )
            {
                return '昵称长度必须在1-6个字符之间!'
            }
        },
        username: [
            /^[\S]{2,6}$/
            , '用户必须2到6位，且不能出现空格'
        ]
    } ),
        initUserInfo()

    // 初始化用户基本信息
    function initUserInfo ()
    {
        $.ajax( {
            method: "GET",
            url: "/my/userinfo",
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '获取用户信息失败！' )
                }
                console.log( res )
                console.log( res.data )

                // layer.msg( '更新用户信息成功！' )
                // 为表单赋值
                form.val( 'formUserInfo', res.data )
            }
        } )


    };

    // 重置用户表单
    $( '#btnReset' ).on( 'click', function ( e )
    {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()

    } );


    // 监听表单提交功能 发起请求
    $( '.layui-form' ).on( 'submit', function ( e )
    {
        // 阻止表单的默认提交行为、
        e.preventDefault()
        // 发起请求
        $.ajax( {
            method: 'POST',
            url: '/my/userinfo',
            data: $( this ).serialize(),
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '获取用户信息失败！' )
                }
                layer.msg( res.message )

                // 调用父页面的封装好的函数
                window.parent.getUserInfo()
            }
        } )
    } )
} );
