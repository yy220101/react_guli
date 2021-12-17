import {SAVE_TITLE} from '../constns'
let initState=''
export default function test(prestate=initState,action){
    const {type,data}=action;
    switch (type) {
        case SAVE_TITLE:
            return data ||null
        default:
            return prestate
    }
}