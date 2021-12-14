import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout } from 'antd';
// import {deleteUser} from '../../redux/actions/login_action'
import {reqCategoryList} from '../../api/index'
import Header from './Header'
import Home from '../../components/Home'
import Categroy from '../Categroy'
import Product from '../Product'
import User from '../User'
import Role from '../Role'
import Bar from '../Bar'
import Line from '../Line'
import Pie from '../Pie'
import './css/index.less'

const { Footer, Sider, Content } = Layout;
@connect(
    state=>({userInfo:state.userInfo}),
    // {deleteUser}
    {}
)
class Admin extends Component {
    // logout=()=>{
        // this.props.deleteUser()
    // }
    categoryList=async()=>{
        const result=await reqCategoryList()
        console.log(result);
    }
    render() {
        const {isLogin}=this.props.userInfo
        if(!isLogin){
            return <Redirect to='/login'/>
        }
        return (
            <Layout className="admin">
                <Sider className="sider">Sider</Sider>
                <Layout>
                    <Header></Header>
                    <Content className='content'>
                        <Switch>
                            <Route path="/admin/home" component={Home}/>
                            <Route path="/admin/prod/categroy" component={Categroy}/>
                            <Route path="/admin/prod/product" component={Product}/>
                            <Route path="/admin/user" component={User}/>
                            <Route path="/admin/role" component={Role}/>
                            <Route path="/admin/charts/bar" component={Bar}/>
                            <Route path="/admin/charts/bar" component={Line}/>
                            <Route path="/admin/charts/pie" component={Pie}/>
                            <Redirect to="/admin/home" component={Home}/>
                        </Switch>
                    </Content>
                    {/* <button onClick={this.categoryList}>点我</button> */}
                    <Footer className='footer'>推荐使用谷歌浏览器，获得最佳用户体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Admin

// export default connect(
//     state=>({userInfo:state.userInfo}),
//     {
//         deleteUser
//     }
// )(Admin)
