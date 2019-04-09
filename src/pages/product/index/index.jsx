
import React,{Component, Fragment} from "react";
import { Card, Table, Button, Input, Select, Icon, message} from "antd";
import { Link } from "react-router-dom";

import MyButton from "../../../components/mybutton/index";
import { reqGetProducts } from "../../../api/index";

import "./index.less";


const Option = Select.Option;

export default class Index extends Component{
  
  state = {
    products: [],
    total: 0
  }
  
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },{
      title: '状态',
      key: 'state',
      render: ()=>{
        return <Fragment>
          <Button type="primary">下架</Button>&nbsp;&nbsp;
          <span>在售</span>
        </Fragment>
      }
    },{
      title: '操作',
      key: 'handle',
      render: ()=>{
        return <Fragment>
          <MyButton>详情</MyButton>&nbsp;&nbsp;
          <MyButton>修改</MyButton>
        </Fragment>
      }
    }
  ];
  
  getProducts = async (pageNum, pageSize = 3 )=>{
    const result = await reqGetProducts(pageNum, pageSize)
    if(result.status === 0){
      this.setState({
        products: result.data.list,
        total: result.data.total,
      })
    }else{
      message.error("失败")
    }
  }
  
  componentDidMount(){
    this.getProducts( 1 )
  }
  
  render(){
    const { products, total } = this.state;
  
    return(
      <Card
        title={
          <Fragment>
            <Select defaultValue="根据商品名称" className="index-select">
              <Option key={0} value={0}>根据商品名称</Option>
              <Option key={1} value={1}>根据商品描述</Option>
            </Select>
            <Input placeholder="关键字" className="index-inp"/>
            <Button type="primary">搜索</Button>
          </Fragment>
        }
        extra={<Link to="/product/saveupdate"><Button type="primary"><Icon type="plus"/>添加产品</Button></Link>}
        className="index"
      >
        <Table
          dataSource={products}
          columns={this.columns}
          bordered
          loading={false}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3","6","9","12"],
            defaultPageSize: 3,
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
            onShowSizeChange: this.getProducts
          }}
          rowKey={"_id"}
        />
      
      </Card>
    )
  }
}