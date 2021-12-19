import React, { Component } from 'react'
import { Button,Card,Form,Input,message,Select   } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { connect } from 'react-redux'
import {reqCategoryList,reqAddProduct,reqDetail,reqUpdateProdList} from '../../../api'
import PicturesWall from './pic_wall'
import Textditor from '../AddUpdate/TextEditor'

// const {Item}=Card
const {Item} = Form
const {Option}=Select 
@connect(
    state=>({cateList:state.cateList,productList:state.productList})
)
class AddUpdate extends Component {
    state={
        cateList:[],     //初始化分类列表
        operaType:'add',
        name:'',
        desc:'',
        price:'',
        categoryId:'',
        detail:'',
        imgs:[],
        _id:''
    }
    //redux中没有分类列表的时候向服务器请求
    getCateList=async()=>{
        let result =await reqCategoryList()
        const {data,status,msg}=result
        status===0?this.setState({cateList:data}):message.error(msg,1)
    }

    //redux中没有就去请求详细信息
    getDtailList=async(id)=>{
        let result=await reqDetail(id)
        const {status,data}=result
        if(status===0)
        this.setState({...data},()=>{
            const {name,desc,price,categoryId}=this.state
            this.formSet.setFieldsValue({name,desc,price,categoryId})
        })
        this.picWall.setPicArr(data.imgs)
        this.RichText.setRichText(data.detail)
    }

    //组件挂载到页面上后取redux中的分类列表，如果没有就调用请求服务器接口的方法
    componentDidMount(){
        //从地址栏中取到商品id，如果是修改就存在id，如果是新增就没有
        const {id}=this.props.match.params
        //从redux中读取分类列表和商品列表
        const {cateList,productList}=this.props
        //如果有id那就是修改，走如下逻辑
        if(id){
            this.setState({operaType:'update'})
            //判断redux中是否存在商品列表
            if(productList.length){
                //redux中有的话就遍历数组，找到其中id跟当前id一样的哪一个对象
                let result=productList.find(item => item._id===id )
                //将对象放到自身状态中，并且读出来赋给页面对应的表单每一项中，新版antd只能通过form实例上的setfieldsvalue
                this.setState({...result},()=>{
                    const {name,desc,price,categoryId}=this.state
                    this.formSet.setFieldsValue({name,desc,price,categoryId})
                })
                //调用picwall组件自身的setPicArr方法，将imgs数组传递过去操作状态进行展示
                this.picWall.setPicArr(result.imgs)
                //调用富文本组件自身的setRichText方法，将详细信息传过去去掉html标签转成对应字符串形式展示在页面上
                this.RichText.setRichText(result.detail)
            }
            //如果redux中没有商品列表就去服务器根据id请求详细信息
            else this.getDtailList(id)
        }
        //如果redux中存在分类列表，就将redux中的分类列表放到自身状态中
        if(cateList.length>0) this.setState({cateList})
        else this.getCateList()
    }
    //表单验证成功之后的回调函数
    onFinish = async(values) => {
        //从上传图片组件中获取图片数组
        let imgs=this.picWall.getPicName()
        //从富文本组件中获取输入的富文本内容
        let detail=this.RichText.getRichText()
        //从状态中读取操作类型是新增还是修改，还有商品的id
        const {operaType,_id}=this.state
        let result
        if(operaType==='add') result =await reqAddProduct({...values,imgs,detail})
        else result=await reqUpdateProdList({...values,imgs,detail,_id})
        const {status,msg}=result
        if(status===0){
            message.success('操作成功',1)
            this.props.history.replace('/admin/prod/product')
        }
        else message.error(msg,1)
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
        const {cateList,operaType}=this.state
        return (
            <Card title={
                <div className='left_top'>
                        <Button type='link' size='small' onClick={()=>this.props.history.goBack()}>
                            <ArrowLeftOutlined  className='arrow_left'/>
                        </Button>
                        <span>{operaType==='update'?'修改商品':'添加商品'}</span>
                </div>
            }>
                <Form 
                    {...layout}  
                    onFinish={this.onFinish} 
                    onFinishFailed={this.onFinishFailed}
                    labelAlign='right'
                    ref={c=>this.formSet=c}
                >
                    <Item name="name" label='商品名称'
                        rules={[
                            { required: true, message: '商品名称不能为空' }
                        ]}>
                        <Input placeholder="商品名称"/>
                    </Item>
                    <Item name="desc" label='商品描述' 
                        initialValue={this.state.desc||''}
                        rules={[
                            { required: true, message: '商品描述不能为空' }
                        ]}>
                        <Input placeholder="商品描述"/>
                    </Item>
                    <Item name="price" label='商品价格' 
                        initialValue={this.state.price||''}
                        rules={[
                            { required: true, message: '商品价格不能为空' },
                        ]}>
                        <Input type='number' prefix='￥' addonAfter='元' placeholder="商品价格"/>
                    </Item>
                    <Item name="categoryId" label='商品分类' 
                        initialValue={this.state.categoryId||''}
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
                                   return <Option key={item._id} value={item._id}>{item.name}</Option>
                               })
                           }
                        </Select>
                    </Item>
                    <Item label='商品图片' wrapperCol={{md:12}}>
                        <PicturesWall ref={c=>this.picWall=c}/>
                    </Item>
                    <Item label='商品详情'  wrapperCol={{md:14}}>
                        <Textditor ref={c=>this.RichText=c}/>
                    </Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form>
            </Card>
        )
    }
}
export default AddUpdate
