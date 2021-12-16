//此文将用来统一处理页面上所有的请求
import Myaxios from './MyAxios';
import {BASE_URL,CITY,WEATHER_AK} from '../config'
// import jsonp from 'jsonp'
// import {message} from 'antd'

//登录请求
//axios的post请求默认将参数转成json进而发送到服务器
//如果后台没有支持json，那么借助qurey-stirng的stringfy方法转成urlEncoded
export const reqLogin= data => Myaxios.post(`${BASE_URL}/api1/login`,data)

//请求商品分类列表
export const reqCategoryList= () => Myaxios.get(`${BASE_URL}/api1/manage/category/list`)

//请求天气信息
// export const reqWeather = (resolve,reject)=>{
//     return new Promise(()=>{
//         jsonp(`${BASE_URL}/api2/weather/v1/?district_id=${CITY}&data_type=all&ak=${WEATHER_AK}`,(err,data)=>{
//             if(err){
//                 message.error('请求天气接口出错，请联系管理员')
//                 return new Promise(()=>{})
//             }else{
//                 const {text_day,low,high}=data.result.forecasts[0]
//                 let result={text_day,low,high}
//                 resolve(result)
//             }
//         })
//     })
// }

//请求天气信息
export const reqWeather= () => Myaxios.get(`${BASE_URL}/api2/weather/v1/?district_id=${CITY}&data_type=all&ak=${WEATHER_AK}`)

//更新分类
export const reqUpdateCate=(categoryId,categoryName)=>Myaxios.post(`${BASE_URL}/api1/manage/category/update`,{categoryId,categoryName})
//新增分类
export const reqAddCate=(data)=>Myaxios.post(`${BASE_URL}/api1/manage/category/add`,data)