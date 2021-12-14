import { SAVE_USER_INFO,DELETE_USER } from '../constns'

export const saveUser=(data)=>{
    localStorage.setItem('user',JSON.stringify(data.user))
    localStorage.setItem('token',data.token)
    return {type:SAVE_USER_INFO,data}
}
export const deleteUser=()=>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return {type:DELETE_USER}
}