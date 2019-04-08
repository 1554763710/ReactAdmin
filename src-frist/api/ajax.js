// 封装ajax组件

import axios from "axios";
import { message } from "antd";

export default function ajax(url, data, method="GET"){
  //data: 请求参数
  method = method.toLocaleUpperCase();
  
  let promise = null;
  
  if(method ==="GET"){
    promise = axios.get(url, {
      params: data
    })
  }else{
    promise = axios.post(url, data)
  }
  //返回一个promise对象
  return promise
    .then(res=>{
      //返回成功的数据
      return res.data
    })
    .catch(err=>{
      //开发人员查看
      console.log(err);
      // 提示用户
      message.error("网路异常,请刷新重试~")
    })
  
}