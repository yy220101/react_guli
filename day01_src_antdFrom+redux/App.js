import React, { Component } from 'react'
import {Route,Routes} from 'react-router-dom'
import Admin from './containers/Admin'
import Login from './containers/Login'

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/admin' element={<Admin/>}/>
                    <Route path='/'/>
                </Routes>
            </div>
        )
    }
}
