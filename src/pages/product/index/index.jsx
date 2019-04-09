
import React,{Component, Fragment} from "react";
import { Card, Table, Button, Input, Select, Icon, message} from "antd";
import { Link } from "react-router-dom";

import MyButton from "../../../components/mybutton/index";
import { reqGetProducts, reqSearchProducts } from "../../../api/index";

import "./index.less";


const Option = Select.Option;

export default class Index extends Component{
  constructor(props){
    super(props);
    this.state = {
      products: [],
      total: 0,
      searchName: "productName",
      pageNum: 1,
      pageSize: 3
    }
  
    this.searchInpContent = React.createRef();
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
      render: (product)=>{
        return <Fragment>
          <MyButton>详情</MyButton>&nbsp;&nbsp;
          <MyButton onClick={this.updateProduct(product)}>修改</MyButton>
        </Fragment>
      }
    }
  ];
  //更新商品内容
  updateProduct = (product)=>{
    return ()=>{
      this.props.history.push("/product/saveupdate", product)
    }
  }
  
  //获取商品列表(后台获取)
  getProducts = async (pageNum, pageSize = 3 )=>{
    
    const searchContent = this.searchContent;
    const { searchName } = this.state;
    let result = null;
    
    if(searchContent){
      result = await reqSearchProducts({pageNum, pageSize, [searchName]: searchContent})
    }else{
      result = await reqGetProducts(pageNum, pageSize)
    }
    
    if(result.status === 0){
      this.setState({
        products: result.data.list,
        total: result.data.total,
        pageNum,
        pageSize
      })
    }else{
      message.error("失败")
    }
  }
  //初次渲染获取第一页
  componentDidMount(){
    this.getProducts( 1 )
  }
  
  handleChange =(value)=>{
    this.setState({
      searchName: value
    })
  }
  
  search = ()=>{
    this.searchContent = this.searchInpContent.current.state.value;
    this.getProducts(1);
  }
  
  render(){
    const { products, total } = this.state;
  
    return(
      <Card
        title={
          <Fragment>
            <Select defaultValue="productName" onChange={this.handleChange} className="index-select">
              <Option key={0} value="productName">根据商品名称</Option>
              <Option key={1} value="productDesc">根据商品描述</Option>
            </Select>
            <Input placeholder="关键字" ref={this.searchInpContent} className="index-inp"/>
            <Button type="primary" onClick={this.search}>搜索</Button>
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