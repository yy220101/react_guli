import React, { Component } from 'react'
import { Button,Card,List, message } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { connect } from 'react-redux'
import {reqDetail,reqCategory} from '../../../api'
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
        console.log(result);
        if(result.name) {
            this.setState({categoryName:result.name})
            console.log(111);
        }
        else this.getCategory()
    }
    componentDidMount(){
        const {id}=this.props.match.params
        const {cateList}=this.props
        let list=this.props.productList.find(item => item._id===id)
        if(list){
            this.setState({data:list,isLoading:false},()=>{
                cateList?this.getReduxCate():this.getCategory()
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
                                    return <img src={`/api1/upload/${item}`} alt='详情图' key='index'/>
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
