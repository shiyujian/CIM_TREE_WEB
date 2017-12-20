import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Modal,Upload,Select,Icon} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
const Search = Input.Search;
export default class ToggleModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: []
        }
    }
    render(){
        const {visible = false} = this.props;
        let jthis = this;
        const props = {
			action: `${SERVICE_API}/excel/upload-api/`,
			headers: {
			},
			showUploadList: false,
		    onChange(info) {
		        if (info.file.status !== 'uploading') {
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    let dataSource = jthis.handleExcelData(importData);
                    jthis.setState({
                        dataSource
                    })
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
        return (
            <Modal
                visible={visible}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <Table 
                    style = {{"textAlign":"center"}}
                    columns={this.columns}
                    bordered={true}
                    dataSource = {this.state.dataSource}
                >
                </Table>
                <Upload {...props}>
                    <Button style={{ margin: '10px 10px 10px 0px' }}>
                        <Icon type="upload" />上传附件
                     </Button>
                </Upload>
                <span>
                    审核人：
                        <Select style={{ width: '200px' }} className="btn" onSelect = {ele=>{
                            console.log(ele);
                            this.setState({passer:ele})
                        }} >
                        {
                            this.state.checkers
                        }
                    </Select>
                </span> 
                <Button type="primary" onClick = {this.onok.bind(this)}>提交</Button>
               <div style={{marginTop:"30px"}}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{paddingLeft:"25px"}}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
               </div>
            </Modal>
        )
    }
     //处理上传excel的数据
     handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map(item => {
            return {
                index: item[0],
                code: item[1],
                type: item[2],
                name: item[3],
                depart: item[4],
                direct: item[5],
                unit: item[6],
                remarks: item[7],
            }
        })
        return res;
    }
    onok(){
        const { actions: { ModalVisible, ModalVisibleOrg } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisible(false);
    }
    cancel() {
        const { actions: { ModalVisibleOrg, ModalVisible } } = this.props;
        ModalVisible(false);
    }
    onChange(){

    }
    componentDidMount(){
        const {actions:{getAllUsers, getProjects}} = this.props;
        getAllUsers().then(rst => {
            let users = [];
            if (rst.length) {
                let checkers = rst.map(o => {
                    return (
                        <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                    )
                })
                this.setState({checkers})
            }
        });
        getProjects().then(rst => {
            console.log("rst:",rst);
            if (rst.children.length) {
                let projects = rst.children.map(item => {
                    return (
                        <Option value={JSON.stringify(item)}>{item.name}</Option>
                    )
                })
                this.setState({projects})
            }
        })
    }
    columns = [{

    },
    {
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
    }, {
        title: '组织机构编码',
        dataIndex: 'code',
        key: 'Code',
    }, {
        title: '组织机构类型',
        dataIndex: 'type',
        key: 'Type',
    }, {
        title: '参建单位名称',
        dataIndex: 'name',
        key: 'Name',
    }, {
        title: '组织机构部门',
        dataIndex: 'depart',
        key: 'depart',
    }, {
        title: '直属部门',
        dataIndex: 'direct',
        key: 'Direct',
    }, {
        title: '负责项目/子项目名称',
        dataIndex: 'project',
        render:(record) => (
            <Select onSelect = {ele => {
                this.setState({pro:ele})
            }}>
                <Option>{this.state.projects}</Option>
            </Select>
        )
    }, {
        title: '负责单位工程名称',
        dataIndex: 'unit',
        key: 'Unit'
    }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'Remarks'
    }, {
        title: '编辑',
        render: (record) => (
            <span>
                <Icon style={{marginRight:"15px"}} type = "edit"/>
                <Icon type = "delete"/>
            </span>
        )
    }]
}