import React, { Component } from 'react';
import { Form, Input, Tree } from 'antd';
import PropTypes from "prop-types";

import menuList from "../../config/menuConfig";

const Item = Form.Item;
const { TreeNode } = Tree;

/*const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [{
      title: '0-0-0',
      key: '0-0-0',
      children: [
        { title: '0-0-0-0', key: '0-0-0-0' },
        { title: '0-0-0-1', key: '0-0-0-1' },
        { title: '0-0-0-2', key: '0-0-0-2' },
      ],
    }, {
      title: '0-0-1',
      key: '0-0-1',
      children: [
        { title: '0-0-1-0', key: '0-0-1-0' },
        { title: '0-0-1-1', key: '0-0-1-1' },
        { title: '0-0-1-2', key: '0-0-1-2' },
      ],
    }, {
      title: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  }, {
    title: '0-2',
    key: '0-2',
  }
  ];*/

@Form.create()
class UpdateRoleForm extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    updateRole: PropTypes.func.isRequired
  }
  
  state = {
    expandedKeys: [],
  }
  
  onCheck = (expandedKeys) => {
   this.props.updateRole(expandedKeys);
  }
  
  
  
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })
  
  render () {
    const { form: { getFieldDecorator }, role: { name, menus }} = this.props;
    
    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {
                initialValue: name
              }
            )(
              <Input placeholder='请输入角色名称' disabled/>
            )
          }
        </Item>
        <Item>
          <Tree
            checkable
            onCheck={this.onCheck}
            defaultExpandAll
            checkedKeys={menus}
          >
            <TreeNode title="平台权限" key="-1">
              {this.renderTreeNodes(menuList)}
            </TreeNode>
          </Tree>
        </Item>
      </Form>
    )
  }
}

export default UpdateRoleForm