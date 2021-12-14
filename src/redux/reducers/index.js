import {combineReducers} from 'redux'
import login_reducer from '../reducers/login_reducer'

export default combineReducers({
    userInfo:login_reducer
})