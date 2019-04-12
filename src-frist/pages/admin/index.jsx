
import React,{Component} from "react";
import { Layout } from 'antd';
import { Route, Switch, Redirect} from "react-router-dom";

import { getItem } from "../../utils/localstoragetool";
import momery from "../../utils/memorytool";
import LeftNav from "../../components/letNav";
import HeaderMain from "../../components/headermain";
//路由组件
import Home from "../home";
import Category from "../category";
import Product from "../product";
import User from "../user";
import Role from "../role";
import Charts from "../charts";

import "./index.less";

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
    if(user && user._id){
      momery.user = user;
    }
    
  }
  
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  
  render() {
    const opacity = this.state.collapsed ? 0 : 1;
    
    if(!momery.user || !momery.user._id){
      return <Redirect to="/login"/>
    }
    
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
            <div className="content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts" component={Charts}/>
                <Redirect to="/home"/>
              </Switch>
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