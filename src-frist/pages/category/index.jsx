
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
      subCategory: {}
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
  
  getCategory = async (parentId)=>{
    const result = await reqCategory(parentId);
    
    if(result.status === 0){
      if(parentId === "0"){
        this.setState({
          categories: result.data
        })
      }else{
        this.setState({
          subcategories: result.data
        })
      }
    }else{
      message.error(result.msg)
    }
    
  }
  
  componentDidMount(){
    this.getCategory("0");
  }
  
  addCategory = ()=>{
    const { validateFields } = this.addCategoryRef.current.props.form;
    const { categories, subcategories } = this.state;
  
    validateFields(async (err,values)=>{
      if(!err){
        const result = await reqAddCategory(values);
        const { parentId } = values;
        if(result.status === 0){
          message.success("添加分类成功");
          if(parentId === "0"){
            this.setState({
              isVisible: false,
              categories: [...categories,result.data]
            })
          }else{
            this.setState({
              isVisible: false,
              subcategories: [...subcategories,result.data]
            })
          }
        }else{
          message.error(result.msg)
        }
      }
    })
    
  }
  
  isUpdateCategoryN = (category)=>{
    return ()=>{
      this.setState({
        category
      })
      this.isShowModal("isUpdateVisible",true)();
    }
  }
  
  updateCName = ()=>{
    const { validateFields, resetFields } = this.updateCategoryRef.current.props.form;
    validateFields( async (err,values)=>{
      if(!err){
        const parentId  = this.state.category._id;
        const { categoryName } = values;
        const result = await reqUpdateCategory({parentId,categoryName});
        if(result.status === 0){
          message.success("更新分类成功");
          
          let name = "categories";
          if(this.state.isShowSubC){
            name = "subcategories";
          }
          
          this.setState({
            isUpdateVisible: false,
            [name]: this.state[name].map((item)=>{
              if (item._id === parentId) {
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
  
  showSubCategory = (subCategory)=>{
    return ()=>{
      this.setState({
        subCategory,
        isShowSubC: true
      })
      this.getCategory(subCategory._id)
    }
  }
  
  isShowModal = (name,isShow)=>{
    return ()=>{
      this.setState({
      [name]: isShow
      })
    }
  }
  
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
      subcategories
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