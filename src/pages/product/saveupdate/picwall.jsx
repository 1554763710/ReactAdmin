
import React,{Component} from "react";
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from "prop-types";

import { reqDelImg } from "../../../api";

export default class PicturesWall extends Component {
  constructor(props){
    super(props);
    const { imgs } = this.props;
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: imgs.map((item,index)=>{
        return {
          uid: -index,
          name: item,
          status: 'done',
          url: 'http://localhost:5000/upload/' + item,
        }
      }),
    };
  }
  
  static propTypes ={
    _id: PropTypes.string.isRequired,
    imgs: PropTypes.array.isRequired
  }
  
  handleCancel = () => this.setState({ previewVisible: false });
  
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  
  handleChange = async ({ file, fileList }) => {
    if(file.status === "done"){
    //  上传成功状态
      const img = fileList[fileList.length-1];
      img.name = file.response.data.name;
      img.url = file.response.data.url;
    }else if(file.status === "removed"){
    //  删除状态
      const { _id } = this.props;
      const result = await reqDelImg( file.name, _id);
      if(result.status === 0){
        message.success("删除图片成功");
      }else{
        message.error(result.msg);
      }
    }else if(file.status === "error"){
    //  上传失败状态
      message.error("上传图片失败");
    }
    this.setState({ fileList })
  };
  
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { _id } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name="image"
          data={{id: _id}}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}