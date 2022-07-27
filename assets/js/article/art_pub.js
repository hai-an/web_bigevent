$( function ()
{
    const form = layui.form
    const layer = layui.layer
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate ()
    {
        $.ajax( {
            method: 'GET',
            url: '/my/article/cates',

            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '初始化文章分类失败!' )
                }
                // 调用模板引擎,渲染分类的下拉菜单
                let htmlStr = template( 'tpl-cate', res )
                $( '[name=cate_id]' ).html( htmlStr )
                // 调用form.render()方法
                form.render()

            }
        } )
    }
    // 1. 初始化图片裁剪器
    var $image = $( '#image' )

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper( options )

    //为 选择封面按钮绑定 选择文件功能
    $( '#btnChooseImage' ).on( 'click', function ()
    {
        $( '#coverFile' ).click()
    } )

    // 为 文件选择 绑定 change 监听/事件
    $( '#coverFile' ).on( 'change', function ( e )
    {
        // 1.获取用户选择的文件
        let files = e.target.files
        // 判断用户是否选择了文件
        if ( files.length === 0 )
        {
            return layer.msg( '请选择图片!' )
        }
        // 2.根据文件,创建对应的url地址
        let newImgURL = URL.createObjectURL( files[ 0 ] )
        // 3.获取图片处�
        $image
            .cropper( 'destroy' )//销毁旧的裁剪区域
            .attr( 'src', newImgURL )//重新设置图片路径
            .cropper( options )//重新初始化裁剪区域

    } )


    // 定义已发布状态
    let art_state = '已发布'
    // 为 存为草稿按钮 绑定点击事件
    $( '#btnSave2' ).on( 'click', function ()
    {
        art_state = '草稿'
    } )


    // 为表单绑定submit提交事件
    $( '#form-pub' ).on( 'submit', function ( e )
    {
        // 阻止默认行为
        e.preventDefault();
        // 2.提交 FormData()
        let fd = new FormData( $( this )[ 0 ] );
        // 3.将文章的发布状态，存到 fd 中
        fd.append( 'state', art_state );
        // //3.遍历
        // fd.forEach( ( value, key ) =>
        // {
        //     console.log( key, value );

        // } )
        // 4.将裁减后的图片,输出为文件
        $image
            .cropper( 'getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            } )
            .toBlob( function ( blob )
            {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象后,存储到fd中
                fd.append( 'cover_img', blob )
                // 6.发起ajax请求
                publishArticle( fd )
            } )

        function publishArticle ( fd )
        {
            $.ajax( {
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意如果是向服务器提交的是FormData格式的数据
                // 必须 添加俩个配置项
                contentType: false,
                processData: false,
                success: function ( res )
                {
                    if ( res.status !== 0 )
                    {
                        return layer.msg( '发布文章失败!' )
                    }
                    layer.msg( '发布文章成功!' )
                    // 发布文章成功后,跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            } )
        }
    } )
} )
