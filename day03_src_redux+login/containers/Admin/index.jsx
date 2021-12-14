import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {deleteUser} from '../../redux/actions/login_action'

class Admin extends Component {
    logout=()=>{
        this.props.deleteUser()
    }
    render() {
        const {user,token,isLogin}=this.props.userInfo
        if(!isLogin){
            return <Redirect to='/login'/>
        }
        return (
            <div>
                Admin
                {
                    console.log(this.props)
                }
                <h2>{user.username}</h2>
                <button onClick={this.logout}>退出登录</button>
            </div>
        )
    }
}
export default connect(
    state=>({userInfo:state.userInfo}),
    {
        deleteUser
    }
)(Admin)
