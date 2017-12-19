import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
const Search = Input.Search;
export default class ToggleModal extends Component{
    render(){
        const {visible} = this.props;
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (
            <Modal
                visible={visible}
                width={1280}
                submit={this.ok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <div>
                    <Button style={{ margin: '10px 10px 10px 0px' }} type="primary">模板下载</Button>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={this.columns}
                        bordered />
                    <Upload {...props}>
                        <Button style={{ margin: '10px 10px 10px 0px' }}>
                            <Icon type="upload" />上传附件
                        </Button>
                    </Upload>
                    <span>
                        审核人：
                    <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                // this.state.checkers
                            }
                        </Select>
                    </span>
                    <Button className="btn" type="primary" onClick={this.submit.bind(this)}>提交</Button>
                </div>
                <div style={{ marginTop: 20 }}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
            </Modal>
        )
    }
    submit(){

    }
    selectChecker(){

    }
    ok(){
      const {actions:{ModalVisible}} = this.props;
      ModalVisible(false);
    }
    cancel(){
      const {actions:{ModalVisible}} = this.props;
      ModalVisible(false);
    }
    onChange(){

    }
    componentDidMount(){

    }
    columns = [ {
        title: '人员编码',
        dataIndex: 'code',
        key: 'Code',
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'Name',
      },{
        title: '所在组织机构单位',
        dataIndex: 'unit',
        key: 'Unit',
      },{
         title: '所属部门',
         dataIndex :'depart',
         key: 'Depart',
      },{
        title: '职务',
        dataIndex :'job',
        key: 'Job',
      },{
        title: '性别',
        dataIndex :'sex',
        key:'Sex'
      },{
        title: '手机号码',
        dataIndex :'tel',
        key:'Tel'
      },{
        title: '邮箱',
        dataIndex :'email',
        key:'Email'
      },{
        title: '二维码',
        dataIndex :'signature',
        key:'Signature'
      },{
        title:'编辑',
        dataIndex:'edit',
        render:(record) => (
          <span>
              <Icon type="edit" />
              <span style={{"padding":"5px"}}>|</span>
              <Icon type="delete" />
          </span>
        )
      }]
}