import React, { Component, Fragment } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import dayjs from "dayjs";

import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import MyButton from '../../components/mybutton';
import { reqGetUserList, reqAddUser, reqDelUser,reqUpdateUser} from "../../api";

const confirm = Modal.confirm;

export default class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [], //用户数组
      isShowAddUserModal: false, //是否展示创建用户的标识
      isShowUpdateUserModal: false, //是否展示更新用户的标识
      roles: [],
      user: {}
    }

    this.addUserForm = React.createRef();
    this.updateUserForm = React.createRef();
  }

  
  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (role_id)=>this.state.roles.find((item)=>item._id === role_id).name
    },
    {
      title: '操作',
      render: user => {
        return <Fragment>
          <MyButton onClick={this.isShowUpdateUserModal(user)}>修改</MyButton>
          <MyButton onClick={this.delUser(user)}>删除</MyButton>
        </Fragment>
      }
    }
  ];
  
  isShowUpdateUserModal = (user)=>{
    return ()=>{
      this.setState({
        isShowUpdateUserModal: true,
        user: user
      })
    }
  }
  
  changeModal = (name, value) => {
    return () => {
      this.setState({[name]: value})
    }
  }
  //获取用户
  getUserList = async ()=>{
    const result = await reqGetUserList();
    if(result.status === 0){
      this.setState({
        users: result.data.users,
        roles: result.data.roles
      })
    }else{
      message.error(result.msg)
    }
  }
  
  //初次渲染
  componentDidMount(){
    this.getUserList();
  }

  //创建用户的回调函数
  handleAddUser = () => {
    const { validateFields, resetFields } = this.addUserForm.current;
    validateFields( async (err,values)=>{
      if(!err){
        const result = await reqAddUser(values);
        if(result.status === 0){
          message.success("添加用户成功");
          this.setState({
            users: [...this.state.users, result.user],
            isShowAddUserModal: false
          })
        }else{
          message.error(result.msg)
        }
        resetFields();
      }
    })
  }
  //更新用户
  handleUpdateUser = () => {
    const { user } = this.state;
    const { validateFields } = this.updateUserForm.current;
    validateFields(async (err, values)=>{
      if(!err){
        const { username, phone, email, role_id } = values;
        const { _id, password } = user;
        const result = await reqUpdateUser({username, phone, email, role_id, _id, password});
        if(result.status === 0){
          message.success("更新用户成功");
          this.setState({
            isShowUpdateUserModal: false,
            users: this.state.users.map((item)=>{
              if(item._id === user._id){
                return {...item, username, phone, email, role_id, password}
              }
              return item;
            })
          })
        }else{
          message.error(result.msg);
        }
      }
    })
  
  }
  //删除用户
  delUser = (user)=>{
    return ()=>{
      const { _id } = user;
      confirm({
        title: <Fragment>您真的要删除<span>name</span>用户</Fragment>,
        onOk : async () => {
          const result = await reqDelUser(_id);
          if(result.status === 0){
            message.success("删除用户成功");
            this.setState({
              users: this.state.users.filter((user)=>user._id !== _id)
            })
          }else{
            message.error("删除用户失败")
          }
        },
        onCancel() {},
        okText: '确定',
        cancelText: '取消',
      });
    }
  }
  render () {
    const { users, isShowAddUserModal, isShowUpdateUserModal, roles, user } = this.state;
    console.log(user)
    return (
      <Card
        title={
          <Button type='primary' onClick={this.changeModal('isShowAddUserModal', true)}>创建用户</Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            showQuickJumper: true,
          }}
        />
  
        <Modal
          title="创建用户"
          visible={isShowAddUserModal}
          onOk={this.handleAddUser}
          onCancel={this.changeModal('isShowAddUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddUserForm ref={this.addUserForm} roles={roles}/>
        </Modal>
  
        <Modal
          title="更新用户"
          visible={isShowUpdateUserModal}
          onOk={this.handleUpdateUser}
          onCancel={this.changeModal('isShowUpdateUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm ref={this.updateUserForm} user={user}/>
        </Modal>
        
      </Card>
    )
  }
}
