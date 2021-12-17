import React, { Component } from 'react'
import { Button, Card ,Table,message,Modal,Input,Form} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import { connect } from 'react-redux';
import {reqCategoryList,reqUpdateCate,reqAddCate} from '../../api'
import {saveCateList} from '../../redux/actions/cate_action'

const {Item}=Form
@connect(
    state=>({}),
    {saveCateList}
)
class Category extends Component {
    state={
        categoryList:[],     //商品分类列表
        visible:false,      //弹窗显示
        type:'',            //控制弹窗复用
        isLoading:true  //页面加载状态
    }
    //请求商品分类列表
    getCategory=async()=>{
        let result=await reqCategoryList()
        this.setState({isLoading:false})
        // console.log(result);
        const {status,data,msg}=result
        if(status===0){
            this.setState({categoryList:data.reverse()})
        }else{
            message.error(msg,1)
        }
        this.props.saveCateList(data)
    }
    //默认组件一挂载就请求
    componentDidMount(){
        this.getCategory()
    }
    //点击显示弹窗的回调
    showModal=(type,data)=>{
        if(type==="add")  this.setState({type:'add'})
        if(type==="change"){
            this.setState({type:'change'})
            //因为是formref.setFieldsValue是异步的，所以使用settimeout0秒解除异步
            //setFieldsValue是回显表单值，对应的修改form中的属性值，比如修改name就是name：xxx
            setTimeout(() => {
                this.Formref.setFieldsValue({categoryName: data.name,categoryid:data._id }) 
            }, 0);
        }
        this.setState({
            visible:true
        })
    }
    //添加分类的回调函数
    toAdd=async(values)=>{
        let result = await reqAddCate(values)
        const {status,data,msg}=result
        const {categoryList}=this.state
        if(status===0){
            this.setState({categoryList:[data,...categoryList]})
            this.setState({
                visible:false
            })
            this.Formref.resetFields()
        }else{
            message.error(msg,1)
        }
    }
    //修改分类的回调函数
    toChange=async(values)=>{
        //getFieldValue是在form组件实例上取到对应属性的值
        const categoryId=this.Formref.getFieldValue('categoryid');
        let result = await reqUpdateCate(categoryId,values.categoryName)
        const {status}=result
        if(status===0){
            this.getCategory()
            this.setState({
                visible:false
            })
            //重置form表单
            this.Formref.resetFields()
        }
    }
    //弹窗确认按钮的回调
    handleOk = () => {
        const {type}=this.state
        //通过ref获取form的实例并从实例上获取到表单统一验证方法
        this.Formref.validateFields().then(values => {
            //表单验证通过后如果是添加分类的时候触发的函数
            if(type==='add') this.toAdd(values)
            if(type==='change') this.toChange(values)
        })
        .catch(errorInfo => {
            message.error('分类名不能为空',1)
        });
    };
    //弹窗取消按钮的回调
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.Formref.resetFields()
        this.setState({
            visible:false
        })
    };
    render() {
        const {categoryList,visible,type,isLoading}=this.state
        //定义表格的列，dataindex要跟数据中要展示的name信息对应，key要跟数据中的key字完全匹配，如果没有
        //使用rowKey解决
        const columns = [
            {
                title: '分类名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                // dataIndex: 'name',
                key: 'name',
                render:(data)=>{return <Button type="link" onClick={()=>this.showModal('change',data)}>修改分类</Button>},
                width:'25%'
            }
        ];
        return (
            <Card 
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.showModal('add')}>
                    添加
                </Button>
            }>
                <Table 
                    dataSource={categoryList}
                    columns={columns} 
                    rowKey='_id' 
                    bordered
                    pagination={{pageSize:5}}
                    loading={isLoading}
                />
                <Modal
                    title={type==='add'?'新增分类':'修改分类'}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    closable={false}
                    okText="确定"
                >
                    <Form className="login-form" ref={c=>this.Formref=c}>
                        <Item name="categoryName"  categoryid='categoryId'
                            rules={[
                                { required: true, message: '分类名不能为空' },
                            ]}>
                            <Input placeholder="请输入分类名" />
                        </Item>
                    </Form>
                </Modal>
            </Card>
        )
    }
}
export default Category