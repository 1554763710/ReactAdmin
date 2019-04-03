
import React,{Component,Fragment} from "react";
import { Row, Col } from 'antd';


import "./index.less";

export default class HeaderMain extends Component{
  
  logout = ()=>{
  
  }
  
  render(){
    return <Fragment>
      <Row className="header-main-top">
        <span>欢迎XXX</span>
        <button onClick={this.logout}>退出</button>
      </Row>
      <Row className="header-main-bottom">
        <Col span={6}></Col>
        <Col span={18}></Col>
      </Row>
    </Fragment>
  }
}