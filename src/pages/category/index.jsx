
import React,{Component} from "react";
import { Card, Button, Icon, Table, message } from 'antd';

import MyButton from "../../components/mybutton";
import { reqCategory } from "../../api";

import "./index.less";

export default class Category extends Component{
  state = {
    categories: []
  }
  
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
      
    }, {
      title: '操作',
      dataIndex: 'operation',
      className: 'operation',
      render: () => <div>
        <MyButton>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
      </div>,
    }
  ];
  
  getCategory = async (parentId)=>{
    const result = await reqCategory(parentId);
    
    if(result.status === 0){
      this.setState({
        categories: result.data
      })
    }else{
      message.error(result.msg)
    }
    
  }
  
  componentDidMount(){
    this.getCategory("0");
  }
  
  render(){
    
    return(
      <Card
        title="一级分类列表"
        extra={<Button type="primary"><Icon type="plus"/>添加品类</Button>}
        className="category"
      >
        <Table
          columns={this.columns}
          dataSource={this.state.categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3","6","9","12"],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          rowKey={"_id"}
        />,
      </Card>
    )
  }
}