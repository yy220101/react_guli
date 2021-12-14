import { createStore,applyMiddleware } from 'redux'
import reducer from './reducers'
//引入异步处理action
import thunk from 'redux-thunk'
//引入redux浏览器插件
import {composeWithDevTools} from 'redux-devtools-extension'

export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))
