import React, { Component } from 'react'
import {Form,Input,Button,message} from 'antd'
import {UserOutlined,LockOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'
import {saveUser} from '../../redux/actions/login_action'
import './css/login.less'
import logo from '../../static/imgs/logo.png'

const {Item} = Form
// 获取当前 location
// const location = history.location;

@connect(
    //从redux中取isLogin在下边用来判断是否登录
    state=>({isLogin:state.userInfo.isLogin}),
    {saveUser}
)
class Login extends Component {
    
    render() {
        const {isLogin}=this.props
        //如果已经登录就不让用户再停留在login页面，直接重定向跳转到home页面
        if(isLogin){
            return <Redirect to='/admin/home'/>
        }
        //form表单验证成功之后的回调函数
        const onFinish = async(values) => {
            // const { username,password }=values
            let result=await reqLogin(values)
            const {data,status}=result
            //reqLogin请求的返回值是一个promise对象，所以使用async，await获取请求成功之后的数据
            //判断状态码为o的时候调用saveUser修改状态的方法向redux中保存数据
            //并且跳转到home页面上，使用replace方法是因为不应该让用户回退到login页面了
            if(status===0){
                this.props.saveUser(data)
                this.props.history.replace('/admin/home')
            }else{
            //请求成功了返回的状态码如果不是0的时候显示对应的msg提示框，一秒钟那个之后消失
                message.warning(result.msg,1)
            }
        };
        //form表单验证失败之后的回调函数
        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1>商城管理系统</h1>
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

export default Login
// function mapDispatchToProps(dispatch){
//     return ()=>{
//        saveUser: dispatch(saveUser)
//     }
// }
// export default connect(
//     state=>({isLogin:state.userInfo.isLogin}),
//     {
//         saveUser
//     }
// )(Login)
