import {SAVE_CATE_LIST} from '../constns'

let initState=[]
export default function test(preState=initState,action){
    const{type,data}=action
    switch (type) {
        case SAVE_CATE_LIST:
            return data
        default:
            return preState
    }
}