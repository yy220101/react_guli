import {combineReducers} from 'redux'
import login_reducer from '../reducers/login_reducer'
import menu_readucer from '../reducers/menu_reducer'

export default combineReducers({
    userInfo:login_reducer,
    title:menu_readucer
})