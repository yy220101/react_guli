import React, { Component } from 'react'
import { Layout,Menu,Button } from 'antd';
import menuList from '../../../config/menuConfig'
import * as Icon from '@ant-design/icons';

import {Link,withRouter} from 'react-router-dom'
import logo from '../../../static/imgs/logo.png'
import './index.less'


const { SubMenu,Item } = Menu;
const { Sider} = Layout;

@withRouter
class LeftNav extends Component {
    state = {
        collapsed: this.props.collapsed,
    };
    toggle  = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };
    iconDOM(name){
        return React.createElement(Icon[name])
    }
    createMenu=(target)=>{
        return target.map((item)=>{
            if(!item.children){
                return (
                    <Item key={item.key} icon={this.iconDOM(item.icon)}>
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
        })
    }
    render() {
        const {MenuUnfoldOutlined,MenuFoldOutlined}=Icon
        // const pathArr=this.props.location.pathname.split('/')
        return (
            <Sider className='sider' trigger={null} collapsible collapsed={this.state.collapsed}>
                <header className='nav_header'>
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统</h1>
                </header>
                <Button className='togg' type="primary" onClick={this.toggle}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: this.toggle,
                    })}
                </Button>
                <Menu
                    defaultSelectedKeys={this.props.location.pathname.split('/').reverse()[0]}
                    defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
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
