$( function ()
{
    getUserInfo()
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
        }
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
