
import React,{Component,Fragment} from "react";
import { Menu, Icon} from "antd";
import { Link , withRouter} from "react-router-dom";
import PropTypes from "prop-types";

import muneList from "../../config/menuConfig";
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
    this.munes = this.createMenu(muneList,openKeys);
    this.state = {
      openKeys
    }
    
  }
  
  static propTypes = {
    opacity: PropTypes.number.isRequired
  }
  
  createItem = (item)=>{
    return <Item key={item.key}>
      <Link to={item.key}>
        <Icon type={item.icon} />
        <span>{item.title}</span>
      </Link>
    </Item>
  }
  
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
            if(pathname === item.key){
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
    const { location:{ pathname },opacity } = this.props;
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