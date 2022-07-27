$( function ()
{
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function ( date )
    {
        const dt = new Date( date )

        let y = padZero( dt.getFullYear() )
        let m = padZero( dt.getMonth() + 1 )
        let d = padZero( dt.getDate() )

        let hh = padZero( dt.getHours() )
        let mm = padZero( dt.getMinutes() )
        let ss = padZero( dt.getSeconds() )

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义一个补零函数
    function padZero ( n )
    {
        return n < 10 ? '0' + n : n
    }


    initTable()
    initCate()
    //获取文章列表的数据
    function initTable ()
    {
        $.ajax( {
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( "获取文章列表失败！" )
                }
                layer.msg( "获取文章列表成功！" )
                // console.log( res );
                // 1.调用模板引擎
                let htmlStr = template( 'tpl-table', res )
                // 2.渲染到tbody中
                $( 'tbody' ).html( htmlStr )
                console.log( htmlStr );
                // 调用渲染分页的方法
                renderPage( res.total )
            }
        } );
    }

    // 获取文章分类列表的数据
    function initCate ()
    {
        $.ajax( {
            method: 'GET',
            url: "/my/article/cates",
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( "获取分类数据失败!" )
                }

                // 1.调用模板引�
                let htmlStr = template( 'tpl-cate', res )
                // 2.渲染到seltect中
                $( '[name=cate_id]' ).html( htmlStr )
                // 3.调用layui提供的 render() 方法重新渲染页面结构
                // console.log( htmlStr );
                form.render()
            }
        } )
    }

    // 为筛选表单   绑定submit事件
    $( '#form-search' ).on( 'submit', function ( e )
    {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $( '[name=cate_id]' ).val();
        let state = $( '[name=state]' ).val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新筛选条件,重新渲染表格的数据
        initTable()
    } )


    // 定义渲染函数的方法
    function renderPage ( total )
    {
        // console.log( total );
        laypage.render( {
            elem: 'pageBox',  //分页容器的Id
            count: total,    //总数据条数
            limit: q.pagesize,   //每页显示几条数据，设置了默认每页显示2条
            curr: q.pagenum, //设置默认被选中的分页
            layout: [ 'count', 'limit', 'prev', 'page', 'next', 'skip' ],
            limits: [ 2, 3, 5, 10 ],
            // 页码发生切换的时候 获取最新的页码值，触发jump回调函数
            // 调用 jump的方式有两种
            // 1.点击 页码 的时候会 触发jump回调
            // 2. 调用laypage.renderPage()方法 就会触发 jump回调
            jump: function ( obj, first )
            {
                // first 可以判断以哪种方式触发  jump回调
                //  如果first 的值为 true,证明是通过 调用laypage.renderPage()方法 就会触发 jump,否则就是点击按钮触发jump的
                // 把最新的页码值,赋值到q这个查询参数对象中
                q.pagenum = obj.curr

                // 把获取到的最新条目数赋值给q.pagesize
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表,并渲染表格
                if ( !first )
                {
                    initTable()
                }
            }
        } )
    }


    // 为 代理绑定 删除按钮
    $( 'tbody' ).on( 'click', '.btn-delete', function ()
    {
        // 获取删除按钮的个数
        let len = $( '.btn-delete' ).length
        // 1.获取文章id
        let id = $( this ).attr( 'data-id' )

        // 2.询问用户是否要删除数据
        layer.confirm( '确认删除?', { icon: 3, title: '提示' }, function ( index )
        {
            $.ajax( {
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function ( res )
                {
                    if ( res.status !== 0 )
                    {
                        return layer.msg( '删除文章失败！' )
                    }
                    layer.msg( '删除文章成功！' )
                    // 当数据删除完毕后,需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值-1之后
                    // 再重新调用 initTable 方法
                    if ( len === 1 )
                    {
                        // 如果ren的值等于1,证明删除完毕之后,页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            } )

            layer.close( index )
        } )
    } )



    //
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
            url: '/my/article/' + id,
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
            url: '/my/article/edit',
            data: $( this ).serialize(),
            contentType: false,
            processData: false,
            success: function ( res )
            {
                if ( res.status !== 0 )
                {
                    return layer.msg( '更新文章失败！' )
                }
                layer.close( indexEdit )
                initTable()
                layer.msg( '更新文章成功！' )
            }
        } )
    } )

} )
