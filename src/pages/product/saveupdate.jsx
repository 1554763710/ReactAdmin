
import React,{Component} from "react";
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from "antd";

import RichEditor from "./richtext";
import {reqCategory} from "../../api";

import "./saveupdate.less";


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
    console.log(this.richEditorRef.current.state.editorState.toHTML())
    this.props.form.validateFields((err, values)=>{
      console.log(values)
    })
  }
  
  onChange = (value)=>{
  
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
  
  componentDidMount(){
    this.getCategory("0")
  }
  
  render (){
  
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Card
        title={<div className="add-product">
          <Icon onClick={this.goBack} type="arrow-left" className="icon"/>
          <span>添加商品</span>
        </div>}
      >
        <Form {...this.formItemLayout} onSubmit={this.submit}>
          <Item label="商品名称">
            {getFieldDecorator(
              "name",
              {
                rules:[{required: true,whiteSpace: true, message: "商品名称不能为空"}]
              }
            )(<Input placeholder="请输入商品名称"/>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator(
              "desc",
              {
                rules:[{required: true,whiteSpace: true, message: "商品描述不能为空"}]
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
                rules:[{required: true, message: "分类不能为空"}]
              }
            )(<Cascader
              options={options}
              onChange={this.onChange}
              placeholder="请选择分类"
              changeOnSelect
              loadData={this.loadData}
            />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator(
              "price",
              {
                rules:[{required: true, message: "商品价格不能为空"}]
              }
            )(<InputNumber
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
              onChange={this.onChange}
              className="input-number"
            />)}
          </Item>
          <Item
            label="商品详情"
            wrapperCol = {
              {
                xs: { span: 24 },
                sm: { span: 21 },
              }
            }
          >
            <RichEditor ref={this.richEditorRef}/>
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