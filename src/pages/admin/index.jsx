
import React,{Component} from "react";
import { Layout } from 'antd';
import { Route } from "react-router-dom";

import { getItem } from "../../utils/localstoragetool";
import momery from "../../utils/memorytool";
import LeftNav from "../../components/letNav";
import Home from "../home";
import Category from "../category";
import Product from "../product";
import HeaderMain from "../../components/headermain";



const {
  Header, Content, Footer, Sider,
} = Layout;


export default class Admin extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
    };
    //判断用户是否登录过
    const user = getItem();
    if(!user||!user._id){
      this.props.history.replace("/login");
    }
    momery.user = user;
  }
  
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  
  render() {
    const opacity = this.state.collapsed ? 0 : 1;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <LeftNav opacity={opacity}/>
        </Sider>
        <Layout>
          <Header className="header" style={{ background: '#fff', padding: 0 }} >
            <HeaderMain />
          </Header>
          <Content style={{ margin: '30px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route path="/home" component={Home}/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product}/>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器,可以获得页面更佳操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}