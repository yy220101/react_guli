import React,{Component} from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../../config'
import {reqRemovePic} from '../../../api'

//将图片转成base64形式的方法
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,  //是否显示预览图
    previewImage: '',       //预览图的图片地址
    // previewTitle: '',
    fileList: [             //显示图片的列表
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }
    ],
  };

  //取出列表中所有图片的名字
  getPicName=()=>{
    const {fileList}=this.state
    let picArr=[]
    fileList.forEach((item)=>{
      picArr.push(item.name)
    })
    return picArr
  }

  setPicArr=(picArr)=>{
    let fileList=[]
    picArr.forEach((item)=>{
      console.log(item);
      fileList.push({
        uid:'-1',
        name:item,
        url:`${BASE_URL}/api1/upload/${item}`
      })
    })
    this.setState({fileList})
  }

  //关闭预览图的回调
  handleCancel = () => this.setState({ previewVisible: false });
  //点击查看预览图的回调
  handlePreview = async file => {
    //如果图片没有url并且不是正在预览，那么就把图片改成base64的形式显示预览图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    //   previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //图片状态发生改变的回调，upLoading、done、error、removed都会触发这个函数
  handleChange = async({ file,fileList }) => {
    //函数会返回file（当前操作的文件对象）fileList（当前的文件列表）
    console.log(file);
    if(file.status==='done'){
      const {status,msg,data}=file.response
      if(status===0){
        fileList[fileList.length-1].name=data.name
        fileList[fileList.length-1].url=data.url
        message.success('上传图片成功',1)
      }
      else message.error(msg,1)
    }
    if(file.status==='removed'){
      let result = await reqRemovePic(file.name)
      const {status,msg}=result
      status===0 ? message.success('删除图片成功',1) : message.error(msg,1)
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/api1/manage/img/upload`} //图片要上传的地址
          method='post'
          name="image"                                  //发到后台的文件参数名
          listType="picture-card"                                   //上传列表的样式
          fileList={fileList}                                       //已经上传的文件列表
          onPreview={this.handlePreview}                      //查看预览图触发的方法
          onChange={this.handleChange}                      //图片状态发生改变的方法
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
        //   title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}