import React, { Component } from 'react'
import { Button, Card ,Table,message,Modal,Input,Form,Tree } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import moment from 'moment'; 
import {connect} from 'react-redux'
import {PAGE_NUMBER} from '../../config'
import {reqRoleList,reqAddRole,reqSetAuth} from '../../api'
import menuList from '../../config/menuConfig'

const {Item}=Form
@connect(
    state=>({userName:state.userInfo.user.username})
)
class Role extends Component {
    state={
        visible:false,      //新增弹窗显示
        setVisible:false,   //设置权限弹窗设置
        isLoading:false,  //页面加载状态
        roleList:[],       //角色列表
        menuList,           //树形列表展示的源数据
        checkedKeys: [],     //选中了哪些列表内容
        dataList:''
    }
    //请求角色列表
    getRoleList=async(pageNum=1)=>{
        let result =await reqRoleList({pageNum,pageSize:PAGE_NUMBER})
        const {status,data,msg}=result
        if(status===0) this.setState({roleList:data})
        else message.error(msg,1)
    }
    //默认组件一挂载就请求
    componentDidMount(){
        this.getRoleList()
    }
    //点击显示新增弹窗的回调
    showModal=()=>{
        this.setState({
            visible:true
        })
    }
    //点击显示设置权限弹窗
    showSetModal=(data)=>{
        this.setState({setVisible:true,dataList:data,checkedKeys:data.menus})
    }
    //添加角色的回调函数
    addRole=async(values)=>{
        let result=await reqAddRole(values)
        const {status,msg}=result
        if(status===0){
             message.success('添加角色成功',1)
             this.getRoleList()
        }
        else message.error(msg,1)
        this.setState({visible:false})
        this.Formref.resetFields()
    }
    //新增弹窗确认按钮的回调
    handleOk = () => {
        // 通过ref获取form的实例并从实例上获取到表单统一验证方法
        this.Formref.validateFields().then(values => {
            this.addRole(values)
        })
        .catch(errorInfo => {
            message.error('角色名不能为空',1)
        });
    };
    //新增弹窗取消按钮的回调
    handleCancel = () => {
        this.Formref.resetFields()
        this.setState({
            visible:false
        })
    };
    //设置权限弹窗确认按钮回调
    setHandleOk= async()=>{
        const {dataList,checkedKeys}=this.state
        const auth_name=this.props.userName
        if(checkedKeys.length){
            let result=await reqSetAuth({_id:dataList._id,menus:checkedKeys,auth_time:Date.now(),auth_name})
            const {status,data,msg}=result
            if(status===0){
                this.setState({checkedKeys:data.menus,setVisible:false})
                this.getRoleList()
            }
            else message.error(msg,1)
        } 
        else message.error('请选择权限',1)
    }
    //设置权限弹窗取消按钮回调
    setHandleCancel = () => {
        // this.Formref.resetFields()
        this.setState({setVisible:false})
    };

    //树型列表选中状态改变触发事件
    onCheck = (checkedKeysValue) => {
        // console.log('onCheck', checkedKeysValue);
        this.setState({checkedKeys:checkedKeysValue})
    };
    render() {
        const {visible,isLoading,setVisible,roleList,menuList}=this.state
        const {total,pageNum,list}=roleList
        //定义表格的列，dataindex要跟数据中要展示的name信息对应，key要跟数据中的key字完全匹配，如果没有
        //使用rowKey解决
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(time)=>time ? moment(time).format("YYYY-MM-DD HH:mm:ss"):''
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                key: 'auth_time',
                render:(time)=>time ? moment(time).format("YYYY-MM-DD HH:mm:ss"):''
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
            },
            {
                title: '操作',
                // dataIndex: 'name',
                key: 'name',
                render:(data)=>{return <Button type="link" onClick={()=>this.showSetModal(data)}>设置权限</Button>},
                width:'25%'
            }
        ];
        //授权列表默认显示的源数据
        const treeData = [
            {
                title: '权限列表',
                key: 'top',
                children: menuList
            }
        ];
          
        return (
            <Card 
            title={
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.showModal()}>
                    新增角色
                </Button>
            }>
                <Table 
                    dataSource={list}
                    columns={columns} 
                    rowKey='_id' 
                    bordered
                    pagination={{
                        pageSize:PAGE_NUMBER,
                        total:total,
                        current:pageNum,
                        onChange:this.getRoleList
                    }}
                    loading={isLoading}
                />
                {/* //新增角色提示框 */}
                <Modal
                    title='新增角色'
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    closable={false}
                    okText="确定"
                >
                    <Form className="login-form" ref={c=>this.Formref=c}>
                        <Item name="roleName"
                            rules={[
                                { required: true, message: '角色名不能为空' },
                            ]}>
                            <Input placeholder="请输入角色名" />
                        </Item>
                    </Form>
                </Modal>
                {/* 设置权限弹窗 */}
                <Modal
                    title='设置权限'
                    visible={setVisible}
                    onOk={this.setHandleOk}
                    onCancel={this.setHandleCancel}
                    cancelText="取消"
                    closable={false}
                    okText="确定"
                >
                    <Form className="setForm">
                        <Tree
                            checkable //是否允许选中
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            treeData={treeData}
                            // expandedKeys={this.state.expandedKeys}
                            defaultExpandAll
                        />
                    </Form>
                </Modal>
            </Card>
        )
    }
}
export default Role