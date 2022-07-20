$( function ()
{
    const form = layui.form
    const layer = layui.layer
    form.verify( {
        pwd: [
            /^[\S]{6,12}$/
            , '用户密码长度必须6到12位之间，且不能出现空格'
        ],
        samePwd: function ( value )
        {
            if ( value === $( '[name=oldPwd]' ).val() )
            {
                return '新密码与原密码不能相同!!'
            }
        },
        rePwd: function ( value )
        {
            if ( value !== $( '[name=newPwd]' ).val() )
            {
                return '两次密码输入不一致,请重新输入!'
            }
        }

    } )


    // 为表单绑定submit事件
    $( '.layui-form' ).on( 'submit', function ( e )
    {
        // 阻止表单的默认提交行为、
        e.preventDefault()
        // post 请求
        $.ajax( {
            method: 'POST',
            url: '/my/updatepwd',
            data: $( this ).serialize(),
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '更新用户信息失败！' )
                }
                // 打印成功的信息
                layer.msg( res.message )
                // 更新成功后 重置用户表单
                $( '.layui-form' )[ 0 ].reset()
            }

        } )
    } )
} )
