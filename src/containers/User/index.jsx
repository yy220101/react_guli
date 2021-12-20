import React, { Component } from 'react'
import { Button, Card ,Table,message,Modal,Input,Form,Select } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import moment from 'moment'; 
import {PAGE_NUMBER} from '../../config'
import {reqUserList,reqAddUser,reqChangeUser,reqDeleUser} from '../../api'

const {Item}=Form
const {Option}=Select
export default class User extends Component {
    state={
        visible:false,
        isLoading:true,
        userList:[],         //用户列表
        roleList:[],         //角色列表
        operaType:'add',    //控制创建用户跟修改用户弹层复用
        deleVisible:false,     //控制删除弹层
        deleId:''           //删除哪一项的id
    }
    componentDidMount(){
        this.getUserList()
    }
    //获取用户列表
    getUserList=async()=>{
        let result = await reqUserList()
        const {status,data,msg}=result
        if(status===0) this.setState({userList:data.users.reverse(),roleList:data.roles,isLoading:false})
        else message.error(msg,1)
    }
    //显示修改用户弹层，并实现数据回显
    changeUser=(data)=>{
        this.setState({visible:true,operaType:'change'})
        setTimeout(() => {
            this.Formref.setFieldsValue({
                username:data.username,
                password:data._id,//借助密码框存一下id，省的在状态里在维护，因为密码不能修改所以修改用户的时候不用传密码
                email:data.email,
                phone:data.phone,
                role_id:data.role_id
            })
        }, 0);
    }
    //点击创建用户，修改用户弹层确定按钮的回调
    handleOk=()=>{
        this.Formref.validateFields().then(async(values)=>{
            const {userList,operaType}=this.state
            let result
            if(operaType==='add'){
                result=await reqAddUser(values)
                const {status,data,msg}=result
                if(status===0) this.setState({visible:false,userList:[data,...userList],isLoading:false})
                else message.error(msg,1)
            }
            else{
                const {email,phone,role_id,password,username}=values
                result=await reqChangeUser({username,email,phone,role_id,_id:password})
                const {status,data,msg}=result
                if(status===0){
                    this.setState({visible:false,isLoading:false})
                    this.getUserList()
                }
                else message.error(msg,1)
            }
            this.Formref.resetFields()
        }).catch(error=>message.error('表单验证错误',1))
    }
    //点弹层取消按钮的回调，创建修改跟删除共用
    handleCancel=()=>{
        this.setState({visible:false,deleVisible:false})
    }
    //显示删除用户的弹层
    deleUser=(data)=>{
        this.setState({deleVisible:true,deleId:data._id})
    }
    //删除用户的回调函数
    deleHandleOk=async()=>{
        const {deleId,userList}=this.state
        let result=await reqDeleUser({userId:deleId})
        const {status,msg}=result
        if(status===0){
            message.success('删除用户成功',1)
            let user=userList.filter((item)=>{
                return item._id!==deleId
            })
            this.setState({userList:user,deleVisible:false,isLoading:false})
        }
        else message.error(msg,1)
    }
    render() {
        //定义表格的列，dataindex要跟数据中要展示的name信息对应，key要跟数据中的key字完全匹配，如果没有
        //使用rowKey解决
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(time)=>time ? moment(time).format("YYYY-MM-DD HH:mm:ss"):''
            },
            {
                title: '操作',
                // dataIndex: 'name',
                key: 'name',
                render:(data)=>{
                    return (
                        <>
                            <Button type="link" onClick={()=>this.changeUser(data)}>修改</Button>
                            <Button type="link" onClick={()=>this.deleUser(data)}>删除</Button>
                        </>
                    )
                },
                width:'25%'
            }
        ];
        const {visible,isLoading,userList,roleList,operaType,deleVisible}=this.state
        const total=userList.length
        return (
            <Card 
            title={
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.setState({visible:true})}>
                    创建用户
                </Button>
            }>
                <Table 
                    dataSource={userList}
                    columns={columns} 
                    rowKey='_id' 
                    bordered
                    pagination={{
                        pageSize:PAGE_NUMBER,
                        total:total,
                    }}
                    loading={isLoading}
                />
                {/* 添加用户提示框 */}
                <Modal
                    title={operaType==='add'?'创建用户':'修改用户'}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    closable={false}
                    okText="确定"
                >
                    <Form className="add_Form" ref={c=>this.Formref=c}>
                        <Item 
                            name="username"
                            label="用户名"
                            rules={[
                                { required: true, message: '用户名不能为空' },
                            ]}>
                            <Input placeholder="请输入用户名" />
                        </Item>
                        <Item 
                            name="password"
                            label="密码"
                            style={{display:operaType==='change'?'none':''}}
                            rules={[
                                { required: true, message: '密码不能为空' },
                            ]}>
                            <Input placeholder="请输入密码" />
                        </Item>
                        <Item 
                            name="phone"
                            label="手机号"
                            rules={[
                                { required: true, message: '手机号不能为空' },
                            ]}>
                            <Input placeholder="请输入手机号" />
                        </Item>
                        <Item 
                            name="email"
                            label="邮箱"
                            rules={[
                                { required: true, message: '邮箱不能为空' },
                            ]}>
                            <Input placeholder="请输入邮箱" />
                        </Item>
                        <Item 
                            name="role_id"
                            label="角色"
                            rules={[
                                { required: true, message: '角色不能为空' },
                            ]}
                        >
                            <Select
                                placeholder="请选择一个角色"
                                // onChange={this.onGenderChange}
                                allowClear
                            >
                            {
                                roleList.map((item)=>{
                                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                                })
                            }
                            </Select>
                        </Item>
                    </Form>
                </Modal>

                {/* 删除用户提示框 */}
                <Modal
                    title='删除用户'
                    visible={deleVisible}
                    onOk={this.deleHandleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    closable={false}
                    okText="确定"
                >
                    <p>确定删除用户吗？</p>
                </Modal>
            </Card>
        )
    }
}
