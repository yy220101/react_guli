import Myaxios from './MyAxios'
import {BASE_URL} from '../config'

//登录请求
//axios的post请求默认将参数转成json进而发送到服务器
//如果后台没有支持json，那么借助qurey-stirng的stringfy方法转成urlEncoded
export const reqLogin= data => Myaxios.post(`${BASE_URL}/api1/login`,data)