import {SAVE_PROD_LIST} from '../constns'

let initState=[]
export default function test(prestate=initState,action){
    const {type,data}=action;
    let newState
    switch (type) {
        case SAVE_PROD_LIST:
            newState=[...data]
            return newState
        default:
            return prestate
    }
}