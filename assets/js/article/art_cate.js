$( function ()
{
    // 1.导入 `layer`
    const layer = layui.layer

    // 导入form 方法
    const form = layui.form

    // 2.为添加按钮绑定点击事件
    let indexAdd = null
    $( '#btnAddCate' ).on( 'click', function ()
    {
        // 3.通过 `layer.open()` 展示弹出层：
        indexAdd = layer.open( {
            // 3.1 图标类型
            type: 1,
            // 3.2 面板面积大小
            area: [ '500px', '250px' ],
            // 3.3 标题文字
            title: '添加文章分类',
            // 3.4 要提示的内容
            content: $( '#dialog-add' ).html(),
        } )
    } )



    // 调用 初始化函数
    initArtCateList()
    // 封装 初始化文章类别的函数
    function initArtCateList ( e )
    {
        $.ajax( {
            method: 'GET',
            url: "/my/article/cates",
            success: function ( res )
            {
                console.log( res );
                console.log( res.message );
                // 1.调用模板引擎
                const strHTML = template( 'tpl-table', res )
                // 2.渲染到tbody中
                $( '#tbody' ).html( strHTML )
            }
        } );
    }


    // 通过代理的形式,为form-add表单绑定submit事件
    $( 'body' ).on( 'submit', '#form-add', function ( e )
    {
        e.preventDefault()
        $.ajax( {
            method: 'POST',
            url: '/my/article/addcates',
            data: $( this ).serialize(),
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '新增分类失败！' )
                }
                initArtCateList()
                layer.msg( '新增分类成功！' )
                // 根据索引，关闭对应的弹出层
                layer.close( indexAdd )
            }
        } )
    } )
    // 通过代理的形式,为form-edit表单绑定submit事件
    let indexEdit = null
    $( 'tbody' ).on( 'click', '.btn-edit', function ()
    {
        // 弹出层一个修改文章分类信息的层
        indexEdit = layer.open( {
            type: 1,
            area: [ '500px', '250px' ],
            title: '修改文章',
            content: $( '#dialog-edit' ).html()
        } )


        let id = $( this ).attr( 'data-id' )
        // 发起请求获取对应分类的数据
        $.ajax( {
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function ( res )
            {
                form.val( 'form-edit', res.data )
                // console.log( '---------事件----------' );

            }
        } )

    } )
    // 通过代理的形式,为修改分类的表单绑定submit事件
    $( 'body' ).on( 'submit', '#form-edit', function ( e )
    {
        e.preventDefault();
        $.ajax( {
            method: 'POST',
            url: '/my/article/updatecate',
            data: $( this ).serialize(),
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '更新分类信息失败！' )
                }
                layer.close( indexEdit )
                initArtCateList()
                layer.msg( '更新分类信息成功！' )
            }
        } )
    } )
    // 通过代理的形式,为删除按钮 绑定submit事件
    $( 'tbody' ).on( 'click', '.btn-delete', function ()
    {
        // 获取删除按钮是个数
        // let len=$('.btn-delete').length
        // 获取文章的id
        let id = $( this ).attr( 'data-id' )
        // 提示框 询问用户是否要删除
        layer.confirm( '确定要删除吗?', { icon: 3, title: '提示' }, function ( index )
        {
            $.ajax( {
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                // 不需要获取表单的值,从云端删除,再初始化界面
                success: function ( res )
                {
                    if ( res.status !== 0 )
                    {
                        return layer.msg( '删除分类失败' )
                    }
                    layer.msg( '删除分类成功' )
                    当数据删除完成
                    layer.close( index )
                    initArtCateList()
                }
            } )
        } )


    } )
} )
