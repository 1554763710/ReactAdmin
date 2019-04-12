
import React,{Component, Fragment} from "react";
import { Card, Icon,  List} from 'antd';

import "./index.less";

const Item = List.Item;

export default class Detail extends Component{
  
  
  
  changeHtml = (detail)=>{
    return <span dangerouslySetInnerHTML={{__html:detail}}/>
  }
  
  goBack = ()=>{
    this.props.history.goBack();
  }
  
  render (){
    const { state } = this.props.location;
    const productImg = <div className="detail-img"><span>商品图片:</span>&nbsp;{ state.imgs.map((item, index)=> <img src={'http://localhost:5000/upload/'+item} key={index} alt={item}/>) }</div>;
    const productDetail = <Fragment>商品详情:&nbsp;{this.changeHtml(state.detail)} </Fragment>;
    const productCategory = <Fragment>商品分类:&nbsp;{state.pName}<Icon type="arrow-right"/>{state.name}</Fragment>
    this.data  = [
      `商品名称: ${state.name}`,
      `商品描述: ${state.desc}`,
      `商品价格: ${state.price}元`,
      productCategory,
      productImg,
      productDetail
    ];
    
    return (
      <Card
        title={<div className="product-detail">
          <Icon onClick={this.goBack} className="icon" type="arrow-left" />
          <span>商品详情</span>
        </div>}
        // style={{ width: "100%" }}
        className="detail"
      >
        <List
          bordered
          dataSource={this.data}
          renderItem={item =>(<Item title="商品详情">{item}</Item>)}
        />
      </Card>
    )
  }
}