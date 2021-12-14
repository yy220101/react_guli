import React, { Component } from 'react'
import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons'
import {Button,Modal} from 'antd'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import screenfull from 'screenfull'
import {deleteUser} from '../../../redux/actions/login_action'
import {reqWeather} from '../../../api'
import './css/header.less'

@connect(
    state=>({userInfo:state.userInfo}),
    {
        deleteUser
    }
)
@withRouter
class Header extends Component {
    state={
        date:new Date(),
        visible:false,
        isFull:false,
        text_day:'',
        low:'',
        high:''
    }

    logout=()=>{
        this.setState({
            visible:true
        })
    }
    handleOk = () => {
        this.props.deleteUser()
    };
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible:false
        })
    };

    //点击全屏按钮的回调函数
    fullScreen=()=>{
        screenfull.toggle()
    }

    //获取天气信息
    getWeather=async()=>{
        let result=await reqWeather()
        const {text_day,high,low}=result.result.forecasts[0]
        this.setState({text_day,high,low})
    }
    componentDidMount(){
        this.timer=setInterval(() => {
            this.setState({
                date:new Date()
            })
        }, 1000);
        //监听全屏的改变，对应显示图标
        screenfull.on('change', () => {
            const isFull=!this.state.isFull
            this.setState({isFull})
        });
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    render() {
        const {user}=this.props.userInfo
        const {isFull,text_day,high,low}=this.state
        return (
            <header className='header'>
                <div className="hader_top">
                    <Button size='small' onClick={this.fullScreen}>
                        {
                            isFull ? <FullscreenExitOutlined/> :
                            <FullscreenOutlined />
                        }
                    </Button>
                    <span className="header_name">欢迎.{user.username}</span>
                    <Button type="link" className="logout" onClick={this.logout}>退出登录</Button>
                    <Modal
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        cancelText="取消"
                        closable={false}
                        okText="确定"
                    >
                        <p>确定要退出登录吗？</p>
                    </Modal>
                </div>
                <div className="hader_bottom">
                    <div className="bottom_left">
                        <span>{this.props.location.pathname}</span>
                    </div>
                    <div className="bottom_right">
                        <span>{moment(this.state.date).format('YYYY-MM-DD hh:mm:ss')}</span>
                        <span className="weather">天气{text_day}</span>
                        <span>温度{low}~{high}℃</span>
                    </div>
                </div>
            </header>
        )
    }
}
export default Header
