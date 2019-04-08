
import React,{Component,Fragment} from "react";
import { Row, Col, Modal, message} from 'antd';
import { withRouter } from "react-router-dom";
import dayjs from "dayjs";

import { removeItem } from "../../utils/localstoragetool";
import memory from "../../utils/memorytool";
import { reqWeather } from "../../api";
import menuList from "../../config/menuConfig";
import MyButton from "../mybutton";


import "./index.less";
@withRouter
class HeaderMain extends Component{
  
  state = {
    time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    weatherImg: "http://api.map.baidu.com/images/weather/day/qing.png",
    weather: "晴"
  }
  
  logout = ()=>{
    Modal.confirm({
      title: '您确认要退出吗?',
      onOk: ()=>{
      //  确认退出的回调 清空内存数据,移除storage,跳转login页面
        removeItem();
        memory.user = {};
        this.props.history.replace("/login");
      },
      okText: '确认',
      cancelText: '取消',
    })
  }
  
  componentDidMount(){
    //更新时间
    this.timer = setInterval(()=>{
      this.setState({
        time: dayjs().format("YYYY-MM-DD HH:mm:ss")
      })
    },1000);
    reqWeather("深圳")
      .then((data)=>{
        const {weatherImg,weather} = data;
        this.setState({
          weatherImg,
          weather
        })
      })
      .catch((err)=>{
        message.error(err);
      })
    
  }
  
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  
  getTitle = ()=>{
    const {pathname} = this.props.location;
    for(let i=0,length =menuList.length;i<length;i++){
      const menu = menuList[i];
      const children = menu.children;
      if(children){
        for (let j=0,length =children.length;j<length;j++){
          let item = children[j];
          if(item.key === pathname){
            return item.title;
          }
        }
      }else{
        if(menu.key === pathname){
          return menu.title;
        }
      }
    }
  }
  
  render(){
    const { time, weatherImg, weather } = this.state;
    const { username } = memory.user;
    const title = this.getTitle();
    return <Fragment>
      <Row className="header-main-top">
        <span>欢迎, {username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </Row>
      <Row className="header-main-bottom">
        <Col className="h-m-b-left" span={6}>{title}</Col>
        <Col className="h-m-b-right" span={18}>
          <span>{time}</span>
          <img src={weatherImg} alt="weather"/>
          <span>{weather}</span>
        </Col>
      </Row>
    </Fragment>
  }
}

export default HeaderMain;