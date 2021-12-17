import {combineReducers} from 'redux'
import login_reducer from '../reducers/login_reducer'
import menu_readucer from '../reducers/menu_reducer'
import product_reducer from '../reducers/product_reducer'
import cate_reducer from '../reducers/cate_reducer'

export default combineReducers({
    userInfo:login_reducer,
    title:menu_readucer,
    productList:product_reducer,
    cateList:cate_reducer
})