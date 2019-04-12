
import React,{Component,Fragment} from "react";
import { Card, Button } from "antd";

export default class Role extends Component{
  render(){
    return (
      <Card
        title={<Fragment><Button type="primary">创建角色</Button></Fragment>}
      >
      </Card>
    )
  }
}