import {LOGIN1,LOGIN2,TEST} from '../../redux/constns'

let initstate='hello'
 export default function test(prestate=initstate,action){
    const {type,data}=action;
    switch (type) {
        case LOGIN1:
            return prestate+data
        case LOGIN2:
            return prestate+data+'!'
        case TEST:
            return prestate+data+'!'
        default:
            return prestate
    }
}