import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Card,Button,Table,Select,Input, message } from 'antd';
import {
    PlusOutlined,
} from '@ant-design/icons';
import {reqProductList,reqUpdateList,reqSearchList} from '../../api'
import {PAGE_NUMBER} from '../../config'

const {Option }=Select
export default class Product extends Component {
    state={
        productList:[], //商品分页列表
        total:'',       //总共多少条数据
        current:1,       //当前页码
        productType:'productDesc',    //通过什么方式搜索
        inputVal:'',         //输入框内容
        isLoading:true,     //页面加载
    }

    //获取商品分页列表。默认页码为1
    getProductList=async(number=1)=>{
        const {productType,inputVal}=this.state
        let result;
        if(this.isSearch) result=await reqSearchList(number,PAGE_NUMBER,productType,inputVal)
        else result=await reqProductList(number,PAGE_NUMBER)
        this.setState({isLoading:false})
        const {status,data}=result
        if(status===0) this.setState({
                productList:data.list,
                total:data.total,
                current:data.pageNum
            })
        else message.error('获取商品列表失败',1)
    }

    //对商品进行上架下架处理
    updateStatus=async(obj)=>{
        let st=obj.status===1?2:1
        let result=await reqUpdateList(obj._id,st)
        const {status}=result
        // status===0 ? this.getProductList() : message.error('更新状态失败',1)
        if(status===0){
            const {productList}=this.state
            let newList=productList.map((item)=>{
                if(item._id===obj._id) item.status=st
                return item
            })
            this.setState({productList:newList})
        }
    }
    //点击搜索按钮的回调
    searchList=()=>{
        this.isSearch=true
        this.getProductList()
    }
    //下拉框值发生变化的回调
    selectChange= event => this.setState({productType:event}) 
    //输入框发生变化的时候的回调
    inputChange= event => this.setState({inputVal:event.target.value})
    
    //页面挂载完成调取数据渲染页面
    componentDidMount(){
       this.getProductList()
    }
    render() {
        const dataSource = this.state.productList
        const {isLoading}=this.state
          
        const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width:'10%',
            render:price => '￥'+price
        },
        {
            title: '状态',
            // dataIndex: 'status',
            key: 'status',
            align:'center',
            width:'10%',
            render:(data)=>{
                return (
                    <>
                        <Button 
                            type='primary'
                            danger={data.status===1}
                            onClick={()=>this.updateStatus(data)}
                        >
                            {data.status===1?'下架':'上架'}
                        </Button>
                        <p>{data.status===1?'在售':'已下架'}</p>
                    </>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align:'center',
            width:'10%',
            render:()=>{
                return (
                    <>
                    <Button type='link'>
                        <Link to='/admin/prod/product/detail'>详情</Link>
                    </Button><br/>
                    <Button type='link'>
                        <Link to='/admin/prod/product/add_update'>修改</Link>
                    </Button>
                    </>
                )
            }
        },
        ];
        return (
            <Card 
                title={
                    <>
                        <Select defaultValue='productDesc' onChange={this.selectChange}>
                            <Option value='productName'>按照名称搜索</Option>
                            <Option value='productDesc'>按照描述搜索</Option>
                        </Select>
                        <Input 
                            placeholder='关键字' 
                            style={{width:'20%',margin:'0 10px'}}
                            allowClear
                            onChange={this.inputChange}
                        />
                        <Button type='primary' onClick={this.searchList}>搜索</Button>
                    </>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />}>
                        <Link to='/admin/prod/product/add_update'>添加商品</Link>
                    </Button>
                }
            >
                <Table 
                    dataSource={dataSource}
                    columns={columns} 
                    rowKey='_id' 
                    bordered
                    pagination={{
                        pageSize:PAGE_NUMBER,
                        total:this.state.total,
                        current:this.state.current,
                        onChange:this.getProductList
                    }}
                    loading={isLoading}
                />
            </Card>
        )
    }
}
