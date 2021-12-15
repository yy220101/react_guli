import {SAVE_USER_INFO,DELETE_USER} from '../constns'

//获取缓存中的user并判断，如果user不为空并且不为undefined，那么就转为对象形式
let user =localStorage.getItem('user')
if(user!==''&&user!=="undefined"){
    user=JSON.parse(user)
} else{
    user=''
}
//获取缓存中的token值
let token=localStorage.getItem('token')
//初始化用户信息
let initState={
    user:user || '',
    token:token || '',
    isLogin:user&&token ? true : false
}
export default function Login(preState=initState,action){
    const {type,data}=action
    // console.log(data);
    switch (type) {
        case SAVE_USER_INFO:
            return {
                user:data.user,
                token:data.token,
                isLogin:true
            }
        case DELETE_USER:
            return {
                user:'',
                token:'',
                isLogin:false
            }
    
        default:
            return preState
    }
}