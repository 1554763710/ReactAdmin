
import React,{Component} from "react";
import {
  Form, Icon, Input, Button, message
} from 'antd';

import { reqLogin } from "../../api";
import { setItem } from "../../utils/localstoragetool";

import logo from "../../assets/images/logo.png";
import "./index.less";

@Form.create()
class Login extends Component{
  
  handleSubmit = (e)=>{
    e.preventDefault();
    // 表单校验
    this.props.form.validateFields(async ( err, values )=>{
      if(!err){
      // 校验成功
        const { username, password } = values;
        const result = await reqLogin({ username, password });
        if(result.status === 0){
          message.success("用户登录成功~",1);
          //保存用户信息到localStorage
          setItem(result.data);
          //跳转到admin页面
          this.props.history.replace("/");
        }else{
          message.error(result.msg, 2)
        }
        
      }else{
      // 校验失败
        console.log(err);
      }
    })
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
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
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