import React, { Component } from 'react'
import { Button,Card,Form,Input,message,Select   } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { connect } from 'react-redux'
import {reqCategoryList} from '../../../api'

// const {Item}=Card
const {Item} = Form
const {Option}=Select 
@connect(
    state=>({cateList:state.cateList})
)
class AddUpdate extends Component {
    state={
        cateList:[]     //初始化分类列表
    }
    //redux中没有分类列表的时候向服务器请求
    getCateList=async()=>{
        // console.log('redux没有数据，向服务器发请求');
        let result =await reqCategoryList()
        const {data,status,msg}=result
        status===0?this.setState({cateList:data}):message.error(msg,1)
    }
    //组件挂载到页面上后取redux中的分类列表，如果没有就调用请求服务器接口的方法
    componentDidMount(){
        const {cateList}=this.props
        if(cateList.length>0) this.setState({cateList})
        else this.getCateList()
    }
    //表单验证成功之后的回调函数
    onFinish = (values) => {
        console.log(values);
    };
    //form表单验证失败之后的回调函数
    onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    };
    render() {
        const layout = {
            labelCol: { md: {span:2} },
            wrapperCol: { md:{span: 9} },
        };
        const {cateList}=this.state
        const {id}=this.props.match.params
        // console.log(id);
        return (
            <Card title={
                <div className='left_top'>
                        <Button type='link' size='small' onClick={()=>this.props.history.goBack()}>
                            <ArrowLeftOutlined  className='arrow_left'/>
                        </Button>
                        <span>{id?'修改商品':'添加商品'}</span>
                </div>
            }>
                <Form 
                    {...layout}  
                    onFinish={this.onFinish} 
                    onFinishFailed={this.onFinishFailed}
                    labelAlign='right'
                >
                    <Item name="cateName" label='商品名称' 
                        rules={[
                            { required: true, message: '商品名称不能为空' },
                        ]}>
                        <Input placeholder="商品名称"/>
                    </Item>
                    <Item name="catedesc" label='商品描述' 
                        rules={[
                            { required: true, message: '商品描述不能为空' },
                        ]}>
                        <Input placeholder="商品描述"/>
                    </Item>
                    <Item name="cateprice" label='商品价格' 
                        rules={[
                            { required: true, message: '商品价格不能为空' },
                        ]}>
                        <Input type='number' prefix='￥' addonAfter='元' placeholder="商品价格"/>
                    </Item>
                    <Item name="cate" label='商品分类' 
                        rules={[
                            { required: true, message: '商品分类不能为空' },
                        ]}>
                        <Select
                            placeholder="请选择分类"
                            onChange={this.onGenderChange}
                            allowClear
                        >
                           {
                               cateList.map((item)=>{
                                   return <Option key={item._id} value={item.name}>{item.name}</Option>
                               })
                           }
                        </Select>
                    </Item>
                    <Item name="catepic" label='商品图片'>
                           <span>图片</span>
                    </Item>
                    <Item name="catedetail" label='商品详情'>
                        <span>此处为富文本编译器</span>
                    </Item>
                    <Item name="catesubmit">
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default AddUpdate
