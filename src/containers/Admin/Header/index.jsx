import React, { Component } from 'react'
import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons'
import {Button,Modal} from 'antd'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import screenfull from 'screenfull'
import {deleteUser} from '../../../redux/actions/login_action'
import menuList from '../../../config/menuConfig'
import {reqWeather} from '../../../api'
import {saveTitle} from '../../../redux/actions/menu_action'
import './css/header.less'

//使用装饰器通过connect连接UI组件，返回一个新的容器组件
@connect(
    //mapStateToProps函数，获取状态值
    state=>({userInfo:state.userInfo,titles:state.title}),
    //mapDispatchToProps函数，获取操作状态值的方法
    {
        deleteUser,
        saveTitle
    }
)
//使用装饰器将header组件通过withRouter函数变为跟路由组件一样可以拥有路由相关api的组件
@withRouter
class Header extends Component {
    state={
        date:new Date(),    //初始化时间
        visible:false,      //初始化确认提示框是否显示
        isFull:false,       //初始化是否全屏
        text_day:'',        //初始化天气信息
        low:'',
        high:''
    }

    //点击退出登录之后控制显示确认提示框
    logout=()=>{
        this.setState({
            visible:true
        })
    }
    //点击确认退出登录的按钮的回调，点击之后操作redux状态，退出登录
    handleOk = () => {
        this.props.deleteUser()
    };
    //确认是否退出登录提示框的取消按钮的回调函数
    handleCancel = () => {
        console.log('Clicked cancel button');
        //并且控制确认提示框隐藏
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
        //reqweather请求返回的是一个promise对象，所以可以用await等待一个请求成功返回的结果
        //要配合async使用，async加在离await最近的箭头上
        let result=await reqWeather()
        //解构出来天气相关信息，改变state中初始化的值并应用在组件相关位置上
        const {text_day,high,low}=result.result.forecasts[0]
        this.setState({text_day,high,low})
    }
    componentDidMount(){
        //组件挂载完成之后声明一个定时器实时改变页面上的时间
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
        //组件挂载完成后获取天气信息
        this.getWeather()
        //手动调用操作头部标题显示函数，以便页面一上来的时候显示头部标题
        this.getTitle()
    }

    //组件将要卸载的时候清除定时器
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    //显示头部标题，不能直接在底部返回，以为当前页面每一秒钟都会从新render
    //默认在组件挂载完成之后手动调用一次
    getTitle=()=>{
        const pathName=this.props.location.pathname
        let title
        if(pathName.indexOf('product')!==-1) title='商品管理'
        //循环menulist找到path相同的那一项，然后返回它的title并赋值给提前声明好的变量
        menuList.forEach((item)=>{
            //判断当前对象下有children并且是一个数组的时候循环children
            if(item.children instanceof Array){
                item.children.forEach((item2)=>{
                    if(item2.path===pathName){
                        return title=item2.title
                    }
                })
            }else{
                //当前对象没有children的时候判断当前对象下的peth跟地址栏路径是否相等
                //相等返回当前对象的title并赋值给提前定义好的title
                if(item.path===pathName) title= item.title
            }
        })
        //存到redux中，用的时候从redux中取
        this.props.saveTitle(title)
    }
    render() {
        //从redux中获取用户信息
        const {user}=this.props.userInfo
        const {isFull,text_day,high,low}=this.state
        // console.log(this.props);
        return (
            <header className='header'>
                <div className="hader_top">
                    {/* 全屏按钮，判断是否全屏控制icon */}
                    <Button size='small' onClick={this.fullScreen}>
                        {
                            isFull ? <FullscreenExitOutlined/> :
                            <FullscreenOutlined />
                        }
                    </Button>
                    <span className="header_name">欢迎.{user.username}</span>
                    <Button type="link" className="logout" onClick={this.logout}>退出登录</Button>
                    {/* 退出登录提示框，点击确定退出，点击取消关闭提示框 */}
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
                        <span>{this.props.titles}</span>
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
