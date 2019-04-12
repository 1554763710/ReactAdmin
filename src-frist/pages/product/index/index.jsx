
import React,{Component, Fragment} from "react";
import { Card, Table, Button, Input, Select, Icon, message} from "antd";
import { Link } from "react-router-dom";

import MyButton from "../../../components/mybutton/index";
import { reqGetProducts, reqSearchProducts, reqGetIdCategory, reqUpdateStatus } from "../../../api/index";

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
      pageSize: 3,
      status: 1
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
      render: (product)=>{
        //商品状态: 1:在售, 2: 下架了
        const { _id, status } = product;
        if(status === 1){
          return <Fragment>
            <Button type="primary" onClick={this.updateStatus(_id,status)}>下架</Button>&nbsp;&nbsp;
            <span>在售</span>
          </Fragment>
        }else{
          return <Fragment>
            <Button type="primary" onClick={this.updateStatus(_id,status)}>上架</Button>&nbsp;&nbsp;
            <span>已下架</span>
          </Fragment>
        }
      }
    },{
      title: '操作',
      key: 'handle',
      render: (product)=>{
        return <Fragment>
          <MyButton onClick={this.addDetail(product)}>详情</MyButton>&nbsp;&nbsp;
          <MyButton onClick={this.updateProduct(product)}>修改</MyButton>
        </Fragment>
      }
    }
  ];
  //商品上下架更新
  updateStatus = (productId,status)=>{
    console.log(productId,status)
    return async ()=>{
      status = status === 1?2:1;
      const result = await reqUpdateStatus(productId,status);
      if(result.status === 0){
        message.success("更新状态成功")
        this.setState({
          products: this.state.products.map((item)=>{
            if(item._id === productId){
              item.status = status;
              return item;
            }
            return item;
          })
        })
      }else{
        message.error("更新状态失败")
      }
    }
  }
  
  
  //详情
  addDetail = (detail)=>{
    return async ()=>{
      const { pCategoryId } = detail;
      const result = await reqGetIdCategory(pCategoryId);
      if(result.status === 0){
        detail.pName = result.data.name;
        this.props.history.push("/product/detail", detail);
      }else{
        message.error("跳转详情失败");
      }
    }
  }
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
    this.getProducts( 1 );
  }
  //选择框变化
  handleChange =(value)=>{
    this.setState({
      searchName: value
    })
  }
  //搜索
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