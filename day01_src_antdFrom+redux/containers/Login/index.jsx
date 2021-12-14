import React, { Component } from 'react'
import {Form,Input,Button} from 'antd'
import {UserOutlined,LockOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {Login1Action,Login2Action} from '../../redux/actions/test'
import axios from 'axios'
import './css/login.less'
import logo from './imgs/logo.png'

const {Item} = Form
class Login extends Component {
    
    render() {
        console.log(this.props);
        const onFinish = (values) => {
            console.log('Success:', values);
            this.props.Login1Action('01111')
            // axios.post('/api1/login')
        };
        
        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1>商城管理系统{this.props.login}</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form className="login-form" onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
                        <Item name="username"  
                            rules={[
                                { required: true, message: '用户名不能为空' },
                                { max: 12, message: '用户名小于等于12位' },
                                { min: 4, message: '用户名大于等于4位' },
                                { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '用户名必须为字母、数字、下划线' },
                            ]}>
                            <Input
                            prefix={<UserOutlined  style={{ color: 'rgba(0,0,0,.25)' }}/>}
                            placeholder="用户名"
                            />
                        </Item>
                        <Item name="password"  
                            rules={[
                                { required: true, message: '密码不能为空' },
                                { max: 12, message: '密码必须小于等于12位' },
                                { min: 4, message: '密码必须大于等于4位' },
                                { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '密码必须为字母、数字、下划线' },
                            ]}>
                            <Input
                            prefix={<LockOutlined  style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state=>({login:state.test}),
    {
        Login1Action,
        Login2Action
    }
)(Login)
