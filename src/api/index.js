//此文将用来统一处理页面上所有的请求
import Myaxios from './MyAxios';
import {BASE_URL,CITY,WEATHER_AK} from '../config'
// import jsonp from 'jsonp'
// import {message} from 'antd'

//登录请求
//axios的post请求默认将参数转成json进而发送到服务器
//如果后台没有支持json，那么借助qurey-stirng的stringfy方法转成urlEncoded
export const reqLogin= data => Myaxios.post(`${BASE_URL}/api1/login`,data)

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

//获取商品分页列表
export const reqProductList =(pageNum,pageSize)=>Myaxios.get(`${BASE_URL}/api1/manage/product/list`,{params:{pageNum,pageSize}})

//对商品进行上架下架处理
export const reqUpdateList=(productId,status)=>Myaxios.post(`${BASE_URL}/api1/manage/product/updateStatus`,{productId,status})

//根据ID/Name搜索产品分页列表/manage/product/search?pageNum=1&pageSize=5&productName=T
//(number,PAGE_NUMBER,productType,inputVal)
export const reqSearchList=(pageNum,pageSize,producetType,inputVal)=>Myaxios.get(`${BASE_URL}/api1/manage/product/search`,{params:{pageNum,pageSize,[producetType]:inputVal}})

//请求商品分类列表
export const reqCategoryList= () => Myaxios.get(`${BASE_URL}/api1/manage/category/list`)

//根据商品id获取详细信息
export const reqDetail=(productId)=>Myaxios.get(`${BASE_URL}/api1/manage/product/info`,{params:{productId}})

//根据分类ID获取分类
export const reqCategory=(categoryId)=>Myaxios.get(`${BASE_URL}/api1/manage/category/info`,{params:{categoryId}})

//删除图片
export const reqRemovePic=(data)=>Myaxios.post(`${BASE_URL}/api1/manage/img/delete`,data)

//添加商品
export const reqAddProduct=(data)=>Myaxios.post(`${BASE_URL}/api1/manage/product/add`,data)

//更新商品
export const reqUpdateProdList=(data)=>Myaxios.post(`${BASE_URL}/api1/manage/product/update`,data)

//获取角色列表
export const reqRoleList = ({...data})=>Myaxios.get(`${BASE_URL}/api1/manage/role/list`,{params:data})

//添加角色
export const reqAddRole= (data)=>Myaxios.post(`${BASE_URL}/api1/manage/role/add`,data)