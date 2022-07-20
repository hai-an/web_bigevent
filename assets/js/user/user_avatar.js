$( function ()
{
    const layer = layui.layer
    // 1.获取裁剪区域的DOM元素
    const $image = $( '#image' )
    // 1.2配置选项
    const options = {
        //纵横比
        aspectRatio: 1,
        //指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper( options )

    //  点击上传按钮  实现文件选择的功能
    $( '#btnChooseFile' ).on( 'click', () =>
    {
        $( '#file' ).click()
    } )

    // 为文件选择框绑定change事件
    $( '#file' ).on( 'change', function ( e )
    {
        let fileList = e.target.files
        console.log( fileList );
        console.log( e.target );

        if ( fileList.length !== 1 )
        {
            return layer.msg( '请选择文件!' )
        }

        // 1.拿到用户选择的图片文件
        const file = e.target.files[ 0 ]
        // 2.把选择的图片文件 转换成url地址
        const newImgURL = URL.createObjectURL( file )
        // 3.替换裁剪区
        $image
            .cropper( 'destroy' ) //销毁旧的裁剪区域
            .attr( 'src', newImgURL ) //重新设置图片路径
            .cropper( options ) //重新初始化裁剪区域

    } )

    // 为确定按钮 绑定
    $( '#btnUpload' ).on( 'click', function ()
    {
        // 1. 要拿到用户裁剪之后的头像
        const dataURL = $image
            .cropper( 'getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            } )
            .toDataURL( 'image/png' ) // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.发送ajax请求
        $.ajax( {
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '更新头像失败!' )
                }
                layer.msg( '更新头像成功!' )

                // 调用父级index页面的函数
                window.parent.getUserInfo()
            }
        } )


    } )

} )
