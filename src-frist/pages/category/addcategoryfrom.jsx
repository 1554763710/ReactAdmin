
import React,{Component} from "react";
import { Form, Select, Input } from 'antd';
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;

@Form.create()
class AddCFrom extends Component{
  
  static propTypes = {
    categories: PropTypes.array.isRequired
  }
  
  validator = (rule, value, callback)=>{
    const { categories } = this.props;
    const category = categories.find((item)=>item.name === value);
    
    if(!value){
      callback("分类名称不能为空");
    }else if(category){
      callback("分类名称不能与之前的相同");
    }else{
      callback();
    }
  }
  
  render(){
    const { categories } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item label="所属分类">
          {getFieldDecorator(
            "parentId",
            {
              initialValue: "0"
            }
          )(
            <Select>
              <Option value="0" key="0">一级分类</Option>
              {categories.map((category)=>{
                return <Option value={category._id} key={category._id}>{category.name}</Option>
              })}
            </Select>
          )}
        </Item>
        <Item label="分类名称">
          {getFieldDecorator(
            "categoryName",
            {
              rules: [
                {validator: this.validator}
              ]
            }
          )(
            <Input placeholder="请输入分类名称"/>
          )}
        </Item>
      </Form>
    )
  }
}
export default AddCFrom;