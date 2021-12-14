import axios from 'axios'
import qs from 'query-string'
import {message} from 'antd'
import Nprogress from 'nprogress'

//使用库提供的配置默认值创建实例
//此时，超时配置值为'0'，这是库的默认值
const instance = axios.create({
    timeout:2500
});

//覆盖库的默认超时
//现在，所有使用此实例的请求都将等待2.5秒，然后超时
// instance.defaults.timeout = 2500;

// 请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config);
    Nprogress.start()
    const {method,data}=config
    //若传递过来的参数是对象
    if(method.toLowerCase==='post'){
        if(data instanceof Object){
            config.data=qs.stringify(data)
        }
    }
    return config;
  }, function (error) {
    Nprogress.start()
    // 处理请求错误
    return Promise.reject(error);
  });

// 响应拦截器
instance.interceptors.response.use(function (response) {
    //在2xx范围内的任何状态代码都会触发此功能
    // 处理响应数据
    Nprogress.done()
    return response.data;
  }, function (error) {
    // 任何超出2xx范围的状态代码都会触发此功能
    // 处理响应错误
    Nprogress.done()
    message.error(error.message,1)
    return new Promise(()=>{});
});

export default instance