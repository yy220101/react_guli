import React, { Component } from 'react'
import { Button,Card,List, message } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { connect } from 'react-redux'
import {reqDetail,reqCategory} from '../../../api'
import {BASE_URL} from '../../../config'
import './index.less'

const {Item}=List
@connect(
    state=>({productList:state.productList,cateList:state.cateList}),
    {}
)
class Detail extends Component {
    state={
        data:{},        //商品所有信息
        categoryName:'',    //商品所属分类
        isLoading:true      //加载状态
    }
    getDetail=async()=>{
        const {id}=this.props.match.params
        let result = await reqDetail(id)
        const {status,data,msg}=result
        if(status===0){
            this.setState({data,isLoading:false})
            this.getCategory()
        }
        else message.error(msg,1)
    }
    getCategory=async()=>{
        const {categoryId}=this.state.data
        let result=await reqCategory(categoryId)
        const {data,status,msg}=result
        status===0 ? this.setState({categoryName:data.name,isLoading:false}) : message.error(msg,1)
    }
    getReduxCate=()=>{
        let result=this.props.cateList.find((item)=>{
            return item._id===this.state.data.categoryId
        })
        if(result.name) {
            this.setState({categoryName:result.name})
        }
        else this.getCategory()
    }
    componentDidMount(){
        //从地址栏中取出id
        const {id}=this.props.match.params
        //从redux中取出商品管理列表
        const {productList}=this.props
        //从redux中取出商品分类列表
        const {cateList}=this.props
        //如果redux中有商品管理列表的时候走下边逻辑
        if(productList.length>0) {
            //遍历
            let list=productList.find(item => item._id===id)
            this.setState({data:list,isLoading:false},()=>{
                cateList.length>0?this.getReduxCate():this.getCategory()
            })
        }
        else this.getDetail()
    }
    render() {
        const {name,desc,price,detail,imgs}=this.state.data
        const {categoryName,isLoading}=this.state
        const element = (<div dangerouslySetInnerHTML={{__html:detail}} />);
        return (
            <Card 
                title={
                    <div className='left_top'>
                        <Button type='link' size='small' onClick={()=>this.props.history.goBack()}>
                            <ArrowLeftOutlined  className='arrow_left'/>
                        </Button>
                        <span>商品详情</span>
                    </div>
                }
            >
                <List loading={isLoading}>
                    <Item>
                        <span className='list_left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='list_left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='list_left'>商品价格：</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className='list_left'>所属分类：</span>
                        <span>{categoryName}</span>
                    </Item>
                    <Item>
                        <span className='list_left'>商品图片：</span>
                        <div>
                            {
                                imgs?
                                imgs.map((item,index)=>{
                                    return <img src={`${BASE_URL}/api1/upload/${item}`} alt='详情图' key='index'/>
                                }):'无'
                            }
                        </div>
                    </Item>
                    <Item>
                        <span className='list_left'>商品详情：</span>
                        {element}
                    </Item>
                </List>
            </Card>
        )
    }
}
export default Detail
