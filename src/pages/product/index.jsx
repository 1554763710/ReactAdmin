
import React,{Component, Fragment} from "react";
import { Card, Table, Button, Input, Select, Icon, message} from "antd";

import MyButton from "../../components/mybutton";
import { reqGetProducts } from "../../api";


const Option = Select.Option;

export default class Product extends Component{
  
  state = {
    products: [],
    total: 0
  }
  
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
  
    
    const columns = [
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
    const { products, total } = this.state;
  
    return(
      <Card
        title={
          <Fragment>
            <Select defaultValue="根据商品名称" style={{ width: 150 }}>
              <Option key={0} value={0}>根据商品名称</Option>
              <Option key={1} value={1}>根据商品描述</Option>
            </Select>
            <Input placeholder="关键字" style={{width: 200,margin: "0 10px"}}/>
            <Button type="primary">搜索</Button>
          </Fragment>
        }
        extra={<Button type="primary"><Icon type="plus"/>添加产品</Button>}
      >
        <Table
          dataSource={products}
          columns={columns}
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
        />
      
      </Card>
    )
  }
}