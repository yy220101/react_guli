const proxy=require('http-proxy-middleware')

module.exports=function (app){
    app.use(
        proxy('/api1',{
            target:'http://localhost:5000',
            changeOrigin:true,
            pathRewrite:{'^/api1':''}
        }),
        proxy('/api2',{
            target:'https://api.map.baidu.com',
            changeOrigin:true,
            pathRewrite:{'^/api2':''}
        })
    )
}