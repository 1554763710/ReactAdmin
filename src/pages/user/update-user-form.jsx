import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";
import {reqGetRoleList} from "../../api";
import {message} from "antd/lib/index";

const Item = Form.Item;
const Option = Select.Option;

@Form.create()
class UpdateUserForm extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }
  
  state = {
    roles: []
  }
  //获取角色权限列表
  getRoleList = async ()=>{
    const result = await reqGetRoleList();
    if(result.status === 0){
      this.setState({
        roles: result.data
      })
    }else{
      message.error(result.msg)
    }
  }
  
  componentDidMount(){
    this.getRoleList();
  }

  render () {
    const { roles } = this.state;
    const { form: {getFieldDecorator}, user } = this.props;
    console.log(user)
    console.log(roles);
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',
              {initialValue: user.username,rules: [{required:true,whitespace:true,message:"用户名不能为空"}]}
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',
              {initialValue: user.phone}
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',
              {initialValue: user.email}
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',
              {
                initialValue: roles.length && roles.find((role) => role._id === user['role_id']).name,
                rules: [{required:true, message:"请选择分类"}]
              }
            )(
              <Select placeholder='请选择分类'>
                {roles.map((role)=><Option key={role._id} value={role._id}>{role.name}</Option>)}
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default UpdateUserForm;