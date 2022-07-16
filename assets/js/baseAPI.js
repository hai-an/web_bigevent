// 每次调用 $.get 或 post 或 ajax()之前都会调用 $.ajaxPrefiler()
$.ajaxPrefilter( function ( option )
{
    // 再发起请求之前,option.url都会发起一次请求路径拼接
    option.url = 'http://www.liulongbin.top:3007/' + option.url
    // 统一  请求头接口 以 /my/ 开头才需要

    // 请求地址 . indexOf('查找的字符串') 找不到返回-1
    if ( option.url.indexOf( '/my/' ) !== -1 )
    {
        option.headers = {
            Authorization: localStorage.getItem( 'token' ) || ''
        }
    }
} )
