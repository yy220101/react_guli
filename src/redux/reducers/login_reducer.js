import {SAVE_USER_INFO,DELETE_USER} from '../constns'

let user =localStorage.getItem('user')
if(user!==''&&user!=="undefined"){
    user=JSON.parse(user)
} else{
    user=''
}
let token=localStorage.getItem('token')
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