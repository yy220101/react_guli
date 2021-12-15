import React, { Component } from 'react'
import { Button, Card ,Table,message,Modal,Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqUpdateCate} from '../../api'

const { confirm } = Modal;
export default class Category extends Component {
    state={
        categoryList:[],     //商品分类列表
        visible:false, 
        name:''
    }
    //请求商品分类列表
    getCategory=async()=>{
        let result=await reqCategoryList()
        // console.log(result);
        const {status,data,msg}=result
        if(status===0){
            this.setState({categoryList:data})
        }else{
            message.error(msg,1)
        }
    }
    //默认组件一挂载就请求
    componentDidMount(){
        this.getCategory()
    }
    changeCate=(event)=>{
        this.changeCateVal=event.target.value
    }
    //修改分类的回调函数
    cateModal=(data)=>{
        let _this=this
        // console.log(data);
        return()=>{
            confirm({
                title: '修改分类',
                icon: '',
                content: <Input defaultValue={data.name} onChange={this.changeCate}/>,
                okText: '确定',
                cancelText: '取消',
                centered:true,
                width:'500px',
                // destroyOnClose:true,
                onOk() {
                    const{_id}=data
                    if(_this.changeCateVal!==undefined&&_this.changeCateVal!==''){
                        // console.log('111');
                        const catename={
                            categoryName:_this.changeCateVal,
                            categoryId:_id
                        }
                        reqUpdateCate(catename).then((resolve,reject)=>{
                            reject=(error)=>{console.log(error);}
                        })
                    }else if(_this.changeCateVal===''){
                        message.error('输入框不能为空',1)
                    }
                },
                onCancel() {},
            });
        }
    }
    render() {
        const {categoryList}=this.state
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
                render:(data)=>{return <Button type="link" onClick={this.cateModal(data)}>修改分类</Button>},
                width:'25%'
            }
        ];
        return (
            <Card 
            extra={
                <Button type="primary" icon={<PlusOutlined />} >
                    添加
                </Button>
            }>
                <Table dataSource={categoryList} columns={columns} rowKey='_id' bordered/>;
            </Card>
        )
    }
}
