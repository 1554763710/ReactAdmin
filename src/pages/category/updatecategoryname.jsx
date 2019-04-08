
import React,{Component} from "react";
import { Form, Input } from 'antd';
import PropTypes from "prop-types";

const Item = Form.Item;

@Form.create()
class UpdateCName extends Component{
  
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  }
  
  validator = (rule, value, callback)=>{
    const { categoryName } = this.props;
    
    if(!value){
      callback("分类名称不能为空");
    }else if(value === categoryName){
      callback("分类名称不能与之前的相同");
    }else{
      callback();
    }
  }
  
  render(){
    const { categoryName } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {getFieldDecorator(
            "categoryName",
            {
              initialValue: categoryName,
              rules: [
                {validator: this.validator}
              ]
            }
          )(
            <Input placeholder="请输入要修改的分类名称"/>
          )}
        </Item>
      </Form>
    )
  }
}
export default UpdateCName;