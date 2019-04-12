
import React,{Component} from "react";
import { Card, Button, Icon, Table, message, Modal } from 'antd';

import MyButton from "../../components/mybutton";
import { reqCategory, reqAddCategory, reqUpdateCategory } from "../../api";
import AddCFrom from "./addcategoryfrom";
import UpdateCName from "./updatecategoryname";

import "./index.less";

export default class Category extends Component{
  constructor(props){
    super(props);
    this.state = {
      categories: [],
      subcategories: [],
      isVisible: false,
      isUpdateVisible: false,
      category: {},
      isShowSubC: false,
      subCategory: {},
      isLoading: true,
    }
    this.addCategoryRef = React.createRef();
    this.updateCategoryRef = React.createRef();
  }
  
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
      
    }, {
      title: '操作',
      // dataIndex: 'operation',
      className: 'operation',
      render: (category) => <div>
        <MyButton onClick={this.isUpdateCategoryN(category)}>修改名称</MyButton>
        {this.state.isShowSubC?null:<MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>}
      </div>,
    }
  ];
  //请求分类列表的数据
  getCategory = async (parentId)=>{
    this.setState({
      isLoading: true
    })
    const result = await reqCategory(parentId);
    const options = {isLoading: false};
    if(result.status === 0){
      //判断要获取的是一级还是二级
      if(parentId === "0"){
        options.categories = result.data
      }else{
        options.subcategories = result.data
      }
    }else{
      message.error(result.msg)
    }
    this.setState(options)
  }
  //首次发送分列数据的请求
  componentDidMount(){
    this.getCategory("0");
  }
  //添加分类
  addCategory = ()=>{
    const { validateFields } = this.addCategoryRef.current.props.form;
    //表单校验方法
    validateFields(async (err,values)=>{
      if(!err){
        const { parentId, categoryName } = values;
        //发送添加分类请求
        const result = await reqAddCategory({ parentId, categoryName });
        if(result.status === 0){
          const { categories, subcategories } = this.state;
          message.success("添加分类成功");
          const options = {isVisible: false};
          //判断一级/二级
          if(parentId === "0"){
            options.categories = [...categories,result.data]
          }else{
            options.subcategories = [...subcategories,result.data]
          }
          this.setState(options);
        }else{
          message.error(result.msg)
        }
      }
    })
    
  }
  //更新分类名称
  updateCName = ()=>{
    const { validateFields, resetFields } = this.updateCategoryRef.current.props.form;
    validateFields( async (err,values)=>{
      if(!err){
        const categoryId  = this.state.category._id;
        const { categoryName } = values;
        const result = await reqUpdateCategory({categoryId,categoryName});
        if(result.status === 0){
          message.success("更新分类成功");
          
          let name = "categories";
          if(this.state.isShowSubC){
            name = "subcategories";
          }
          
          this.setState({
            isUpdateVisible: false,
            [name]: this.state[name].map((item)=>{
              if (item._id === categoryId) {
                return {...item, name: categoryName}
              }
              return item
            })
          })
          resetFields();
        }else{
          message.error("失败")
        }
      }
      
    })
    
  }
  //点击获取二级分类名称
  showSubCategory = (subCategory)=>{
    return ()=>{
      this.setState({
        subCategory,
        isShowSubC: true
      })
      this.getCategory(subCategory._id)
    }
  }
  //点击获取一级分类名称
  isUpdateCategoryN = (category)=>{
    return ()=>{
      this.setState({
        category
      })
      this.isShowModal("isUpdateVisible",true)();
    }
  }
  //点击是否显示
  isShowModal = (name,isShow)=>{
    return ()=>{
      this.setState({
        [name]: isShow
      })
    }
  }
  //回退到一级列表
  goBack = ()=>{
    this.setState({
      isShowSubC: false
    })
  }
  
  render(){
    const {
      categories,
      isVisible,
      isUpdateVisible,
      category,
      isShowSubC,
      subCategory,
      subcategories,
      isLoading
    } = this.state;
    return(
      <Card
        title={isShowSubC?<div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type="arrow-right"/><span>{subCategory.name}</span></div>:"一级分类列表"}
        extra={<Button type="primary" onClick={this.isShowModal("isVisible",true)}><Icon type="plus"/>添加品类</Button>}
        className="category"
      >
        <Table
          columns={this.columns}
          dataSource={isShowSubC?subcategories:categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3","6","9","12"],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          rowKey={"_id"}
          loading={isLoading}
        />
        <Modal
          title="添加分类"
          visible={isVisible}
          onOk={this.addCategory}
          onCancel={this.isShowModal("isVisible",false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCFrom categories={categories} wrappedComponentRef={this.addCategoryRef}/>
        </Modal>
        
        <Modal
          title="更新分类"
          visible={isUpdateVisible}
          onOk={this.updateCName}
          onCancel={this.isShowModal("isUpdateVisible",false)}
          okText="确认"
          cancelText="取消"
          width={300}
        >
          <UpdateCName categoryName={category.name} wrappedComponentRef={this.updateCategoryRef}/>
        </Modal>
      </Card>
    )
  }
}