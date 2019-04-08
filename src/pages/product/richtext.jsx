import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

export default class RichEditor extends React.Component {
  
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null)
  }
  
  async componentDidMount () {
    // 假设此处从服务端获取html格式的编辑器内容
    const htmlContent = "初始化数据"
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent)
    })
  }
  
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }
  
  render () {
    
    const { editorState } = this.state
    return (
      <div style={{border: "1px solid #d9d9d9", height: 300, borderRadius: 4}}>
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
        />
      </div>
    )
    
  }
  
}