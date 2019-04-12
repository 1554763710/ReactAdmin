
import React,{Component,Fragment} from "react";
import { Menu, Icon} from "antd";
import { Link , withRouter} from "react-router-dom";
import PropTypes from "prop-types";

import muneList from "../../config/menuConfig";
import memory from "../../utils/memorytool";

import logo from "../../assets/images/logo.png";
import "./index.less";

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

//将非路由组件件添加路由组件的三大属性
@withRouter
class LeftNav extends Component{
  constructor(props){
    super(props);
    const openKeys = [];
    const munes = this.getMenu(muneList);
    this.munes = this.createMenu(munes,openKeys);
    this.state = {
      openKeys
    }
    
  }
  
  static propTypes = {
    opacity: PropTypes.number.isRequired
  }
  //定义组件合成函数
  createItem = (item)=>{
    return <Item key={item.key}>
      <Link to={item.key}>
        <Icon type={item.icon} />
        <span>{item.title}</span>
      </Link>
    </Item>
  }
  //创建菜单
  createMenu = (muneList, openKeys)=>{
    const { pathname } = this.props.location;
    return muneList.map((menu)=>{
      const children = menu.children;
      if(children){
      //  二级菜单
        return <SubMenu
          key={menu.key}
          title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}
        >
          {children.map((item)=>{
            if(pathname.startsWith(item.key) || item.key.startsWith(pathname)){
              openKeys.push(menu.key);
            }
            return this.createItem(item)
          })
          }
        </SubMenu>
      }else{
      //  一级菜单
        return this.createItem(menu)
      }
    })
  }
  //获取过滤后的菜单
  getMenu = ( muneList )=>{
    const { menus } = memory.user.role;
    return muneList.reduce((prev, curr) => {
      const children = curr.children;
      if(menus.find((menu)=>menu === curr.key)){
        if(children){
          curr.children = children.filter((item)=>menus.find((menu)=>menu === item.key))
        }
        return [...prev, curr]
      }else{
        return prev;
      }
    },[])
  }
  
  onOpenChange = (openKeys)=>{
    this.setState({
      openKeys
    })
  }
  
  closeClick = ()=>{
    this.setState({
      openKeys: []
    })
  }
  
  render(){
    let { location:{ pathname },opacity } = this.props;
    if(pathname.startsWith("/product")){
      pathname = "/product";
    }
    const {openKeys} = this.state;
    return (
      <Fragment>
        <Link className="logo" to="/home" onClick={this.closeClick}>
          <img src={logo} alt="logo"/>
          <h2 style={{opacity}}>尚硅谷后台</h2>
        </Link>
        <Menu theme="dark" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={this.onOpenChange} mode="inline">
          {this.munes}
        </Menu>
      </Fragment>
    )
  }
}
export default LeftNav;