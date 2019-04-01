
import React,{Component} from "react";
import {
  Form, Icon, Input, Button,
} from 'antd';

import logo from "./logo.png";
import "./index.less";

@Form.create()
class Login extends Component{
  
  handleSubmit = (e)=>{
    e.preventDefault();
  }
  
  validator = (rule,value,callback)=>{
    const length = value && value.length;
    const valueReg = /^[a-zA-Z0-9]+$/;
    if(!value){
      callback("必须要输入密码");
    }else if(length<4){
      callback("密码必须大于4位");
    }else if(length>12){
      callback("密码必须小于12位");
    }else if(!valueReg.test(value)){
      callback("密码必须是英文、数组或下划线组成");
    }else{
      callback();
    }
  }
  
  render(){
    const { getFieldDecorator } = this.props.form;
    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目:后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("username",{
              rules:[
                {required: true,whitespace: true,message: "必须要输入用户名"},
                {min: 4,message: "用户名必须大于4位"},
                {max: 12,message: "用户名必须小于12位"},
                {pattern: /^[a-zA-Z0-9]+$/, message:"用户名必须是英文、数组或下划线组成"}
              ]
            })(
              <Input prefix={<Icon type="" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password",{
              rules: [
                {validator: this.validator}
              ]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      
      </section>
    </div>
  }
}
export default Login;