import React, { Component } from 'react'
import { Layout,Menu,Button } from 'antd';
//引入antd的icon库并且给它起一个别名为Icon，供下边循环遍历生成图标使用
import * as Icon from '@ant-design/icons';
import {Link,withRouter} from 'react-router-dom'
import { connect } from 'react-redux';
import { saveTitle } from '../../../redux/actions/menu_action';
import menuList from '../../../config/menuConfig'
import logo from '../../../static/imgs/logo.png'
import './index.less'


const { SubMenu,Item } = Menu;
const { Sider} = Layout;

//返回一个新的容器组件
@connect(
    //如果当前组件不需要获取状态值就可以返回一个空的对象，但是不能不写，需要占位
    state=>({user:state.userInfo.user}),
    //获取操作状态的方法
    {
        saveTitle
    }
)
@withRouter
class LeftNav extends Component {
    state = {
        collapsed: this.props.collapsed,       //初始化左侧菜单是否展开
    };
    //点击总的展开收起按钮的回调函数，通过改变状态值来控制，来自antd
    toggle  = () => {
        this.setState({
          collapsed: !this.state.collapsed
        });
    };
    //生成列表前边对应的icon，因为新版的antd不再以type防止控制icon而是直接写标签名字
    //所以循环显示列表时需要新建一个节点
    iconDOM(name){
        //icon[name]的含义等同于icon.name含义就是从icon中解构出一个name
        return React.createElement(Icon[name])
    }

    //处理用户权限，能对应显示给用户授权的菜单
    hasAuth=(item)=>{
        const {role:{menus},username}=this.props.user
        if(username==='admin') return true
        else if(!item.children){
            return menus.find((item2)=> item.key===item2 )
        }
        else if(item.children){
            // return menus.find((item3)=>{
            //     return item.children.find((item4)=>{
            //         return item3===item4.key
            //     })
            // })
            return item.children.some((item3)=>{return menus.indexOf(item3.key)!==-1})
        }
    }

    //这个一个递归，careateMenu传入一个数组进行遍历，因为二级菜单所以还有数组，
    //这时候再次调用createMenu进入循环，直到完全遍历完所有数组
    createMenu=(target)=>{
        return target.map((item)=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                        <Item key={item.key} icon={this.iconDOM(item.icon)} onClick={()=>this.props.saveTitle(item.title)}>
                            <Link to={item.path}>{item.title}</Link>
                        </Item>
                    )
                }else{
                    return(
                        <SubMenu key={item.key} icon={this.iconDOM(item.icon)} title={item.title}>
                            {
                                this.createMenu(item.children)
                            }
                        </SubMenu>
                    )
                }
            }
        })
    }
    render() {
        //从icon中取出两个图标
        const {MenuUnfoldOutlined,MenuFoldOutlined}=Icon
        const {pathname}=this.props.location
        return (
            // 这里为了实现收起整个左侧菜单的功能，所以最外部比如是一个sider标签
            //具体使用参考antd文档
            <Sider className='sider' trigger={null} collapsible collapsed={this.state.collapsed}>
                <header className='nav_header'>
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统</h1>
                </header>
                {/* 这个Button是从antd引入的，它在这的作用是控制左侧导航的折起 */}
                <Button className='togg' type="primary" onClick={this.toggle}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: this.toggle,
                    })}
                </Button>
                {/* 
                    遍历生成菜单，通过地址栏控制默认选中的菜单和默认打开的二级菜单名称 
                    reverse是数组的倒叙方法，目的是选中路径的最后一级
                    defaultOpenKeys接收的必须是一个数组，可以接收多个值底层会自动处理
                */}
                <Menu
                    selectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()[0]}
                    defaultOpenKeys={pathname.split('/').splice(2)}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.createMenu(menuList)
                    }
                </Menu>
            </Sider>
        )
    }
}
export default LeftNav
