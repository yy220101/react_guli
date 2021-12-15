import { SAVE_USER_INFO,DELETE_USER } from '../constns'

//定义保存用户相关信息的方法
export const saveUser=(data)=>{
    localStorage.setItem('user',JSON.stringify(data.user))
    localStorage.setItem('token',data.token)
    return {type:SAVE_USER_INFO,data}
}
//定义退出登录的方法，退出登录就是清空localstorage中保存的所有用户相关的信息
export const deleteUser=()=>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return {type:DELETE_USER}
}