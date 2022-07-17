$( function ()
{
    getUserInfo()


    //引入插件的方法
    const layer = layui.layer

    // 实现点击按钮 退出功能
    $( '#btnLogout' ).on( 'click', function ()
    {
        // 1.弹出提示框
        layer.confirm( '确定要退出登录吗?', { icon: 3, title: '提示' }, function ( index )
        {
            // 2.清除 本地存储token值
            localStorage.removeItem( 'token' )
            //3. 跳转到登录页面
            location.href = '/login.html'
            //4. 关闭询问框
            layer.close( index );
        } );

    } )
} )
// 获取用户基本信息
function getUserInfo ()
{
    $.ajax( {
        method: "GET",
        url: "my/userinfo",
        // data: "data",
        // headers: {
        //     Authorization: localStorage.getItem( 'token' ) || ''
        // },
        success: function ( res )
        {
            if ( res.status !== 0 )
            {
                return layui.layer.msg( '获取用户信息失败!' );

            }

            console.log( res.message );
            // 成功 调用 renderAvatar渲染头像函数
            renderAvatar( res.data )
        },

        // 不管成功还是失败都会调用 complete函数
    //     complete: function ( res )
    //     {
    //         console.log( res );
    //         // 失败的情况下
    //         if ( res.responseJSON.message === "身份认证失败！" &&
    //             res.responseJSON.status === 1 )
    //         {
    //             console.log( '111' );
    //             // 清除 本地存储token值
    //             localStorage.removeItem( 'token' )
    //             // 跳转到登录页面
    //             location.href = '/login.html'
    //         }

    //     }

    } );
}

// 定义头像渲染函数
function renderAvatar ( user )
{
    //   1.获取欢迎文本
    const name = user.nickname || user.username
    // 2.设置欢迎文本
    $( '#welcome' ).html( '欢迎&nbsp;&nbsp;' + name )
    //  2.显示头像
    if ( user.user_pic !== null )
    {
        // 显示图片头像,隐藏文字头像
        $( '.layui-nav-img' ).attr( 'src', user.user_pic ).show()
        $( '.text-avatar' ).hide()
    } else
    {
        // 把名称首字母大写 并单独取出来
        const fisrt = name[ 0 ].toUpperCase()
        // 显示文字头像,隐藏图片头像
        $( '.text-avatar' ).html( fisrt ).show()
        $( '.layui-nav-img' ).hide()
    }

}
