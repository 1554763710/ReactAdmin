
import React,{Component} from "react";
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from "antd";

import RichEditor from "./richtext";
import {reqCategory, reqAddProduct, reqUpdateProduct } from "../../../api";
import PicturesWall from "./picwall";

import "./index.less";


const Item = Form.Item;
@Form.create()
class SaveUpdate extends Component{
  constructor(props){
    super(props);
    this.state = {
      options: []
    }
    this.richEditorRef = React.createRef();
  }
  
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };
  //回退历史
  goBack = ()=>{
    this.props.history.goBack();
  }
  //点击提交得到的数据
  submit = (e)=>{
    e.preventDefault();
    this.props.form.validateFields( async (err, values)=>{
      
      if(!err){
        const {name, desc, category, price} = values;
        const detail = this.richEditorRef.current.state.editorState.toHTML();
        let categoryId,pCategoryId;
        if(category.length === 1){
          pCategoryId = "0";
          categoryId = category[0];
        }else{
          pCategoryId = category[0];
          categoryId = category[1];
        }
        const { location: { state } } = this.props;
        let result;
        let msg = "";
        
        if(state){
          msg = "修改商品成功";
          console.log(detail);
          result = await reqUpdateProduct({ name, desc, price, detail, pCategoryId, categoryId, _id: state._id });
        }else{
          msg = "添加商品成功";
          result = await reqAddProduct({ name, desc, price, detail, pCategoryId, categoryId });
        }
        if(result.status === 0){
          message.success(msg);
          this.props.history.goBack();
        }else{
          message.error(result.msg);
        }
        
      }
      
    })
  }
  
  
  //获取分类列表
  getCategory = async (parentId)=>{
    
    const result = await reqCategory(parentId);
    if(result.status === 0){
      if(parentId === "0"){
        this.setState({
          options: result.data.map((option)=>{
            return {
              value: option._id,
              label: option.name,
              isLeaf: false,
            }
          })
        })
      }else{
        this.setState({
          options: this.state.options.map((option)=>{
            if( option.value === parentId ){
              option.children = result.data.map((item)=>{
                return {
                  value: item._id,
                  label: item.name,
                  key: item._id,
                }
              })
              option.loading = false;
              option.isLeaf = true;
            }
            return option
          })
        })
      }
    }else{
      message.error(result.msg)
    }
    
  }
  //loading获取二级分类列表
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.getCategory(targetOption.value)
  }
  //初次渲染获取
  componentDidMount(){
    this.getCategory("0");
    //修改商品设置分类
    const { state  } = this.props.location;
    if(state){
      const { pCategoryId, categoryId } = state;
      if(pCategoryId === "0"){
        this.category = [ categoryId ]
      }else{
        this.category = [ pCategoryId, categoryId]
      }
      this.getCategory(pCategoryId);
    }
  }
  
  render (){
      /*{…}
  __v:
  0
  _id:
  "5caab280aea7c918a876506f"
  categoryId:
  "5caab260aea7c918a876506e"
  desc:
  "肾1"
  detail:
  "<p>肾1</p>\n"
  imgs:
  Array[0]
  name:
  "肾1"
  pCategoryId:
  "5ca4b5290765861a14206b48"
  price:
  10000
  status:
  2*/
    
  
    const { options } = this.state;
    const { form: { getFieldDecorator } ,location: { state } } = this.props;
    return (
      <Card
        title={<div className="add-product">
          <Icon onClick={this.goBack} type="arrow-left" className="icon"/>
          <span>{state?"修改商品":"添加商品"}</span>
        </div>}
      >
        <Form {...this.formItemLayout} onSubmit={this.submit}>
          <Item label="商品名称">
            {getFieldDecorator(
              "name",
              {
                rules:[{required: true,whiteSpace: true, message: "商品名称不能为空"}],
                initialValue: state? state.name:""
              }
            )(<Input placeholder="请输入商品名称"/>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator(
              "desc",
              {
                rules:[{required: true,whiteSpace: true, message: "商品描述不能为空"}],
                initialValue: state? state.desc:""
              }
            )(<Input placeholder="请输入商品描述"/>)}
          </Item>
          <Item
            label="选择分类"
            wrapperCol = {
              {
                xs: { span: 24 },
                sm: { span: 5 },
              }
            }
          >
            {getFieldDecorator(
              "category",
              {
                rules:[{required: true, message: "分类不能为空"}],
                initialValue: state? this.category:[]
              }
            )(<Cascader
              options={options}
              // onChange={this.onChange}
              placeholder="请选择分类"
              changeOnSelect
              loadData={this.loadData}
            />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator(
              "price",
              {
                rules:[{required: true, message: "商品价格不能为空"}],
                initialValue: state? state.price:""
              }
            )(<InputNumber
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
              onChange={this.onChange}
              className="input-number"
            />)}
          </Item>
          {state?<Item label="商品图片"><PicturesWall _id={state._id} imgs={state.imgs}/></Item>:""}
          <Item
            label="商品详情"
            wrapperCol = {
              {
                xs: { span: 24 },
                sm: { span: 21 },
              }
            }
          >
            <RichEditor ref={this.richEditorRef} detail={state?state.detail:""}/>
          </Item>
          <Item>
            <Button className="su-btn" type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      
      </Card>
    )
  }
}
export default SaveUpdate;