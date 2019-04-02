
import React,{Component} from "react";

import { getItem } from "../../utils/localstoragetool";
import momery from "../../utils/memorytool";

export default class Admin extends Component{
  
  constructor(props){
    super(props);
    //判断用户是否登录过
    const user = getItem();
    if(!user||!user._id){
      this.props.history.replace("/login");
    }
    momery.user = user;
  }
  
  render(){
    return <div>
      Admin
    </div>
  }
}