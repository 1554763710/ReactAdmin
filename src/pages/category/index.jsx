
import React,{Component} from "react";
import { Card, Button, Icon, Table } from 'antd';

import MyButton from "../../components/mybutton";

import "./index.less";

export default class Category extends Component{
  render(){
    const columns = [
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
  
    const data = [
      {
        key: '1',
        name: '手机'
      }, {
        key: '2',
        name: '电脑'
      }, {
        key: '3',
        name: '平板'
      }, {
        key: '4',
        name: 'xx'
      }, {
        key: '5',
        name: 'zzz'
      }, {
        key: '6',
        name: 'aaa'
      }
    ];
    
    return(
      <Card
        title="一级分类列表"
        extra={<Button type="primary"><Icon type="plus"/>添加品类</Button>}
        className="category"
      >
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3","6","9","12"],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
        />,
      </Card>
    )
  }
}