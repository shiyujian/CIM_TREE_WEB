import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import Card from '_platform/components/panels/Card';
import {getNextStates} from '_platform/components/Progress/util';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE} from '_platform/api';
import {getUser} from '_platform/auth';
const Option = Select.Option;
var moment = require('moment');

export default class WorkModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
            dataSource: [],
			units:[],
			projecttrees: [],
            checkers: [],
            check:null,
		};
	}
	componentDidMount(){
        const {actions:{getAllUsers,getProjectTree}} = this.props
        getAllUsers().then(res => {
            let checkers = res.map((o,index) => {
                return (
                    <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
        getProjectTree({},{depth:1})
        .then(res => {

        	let projecttrees = res.children.map((o,index) => {
                return (
                    <Option key={index} value={JSON.stringify({pk:o.pk,name:o.name})}>{o.name}</Option>
                )
            })
            this.setState({projecttrees})
        })
    }
	render() {
		const columns = [{
			title: '序号',
			dataIndex: 'key',
		}, {
			title: 'WBS编码',
			dataIndex: 'code'
		}, {
			title: '任务名称',
			dataIndex: 'name'
		}, {
			title: '项目/子项目名称',
			dataIndex:'project',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.projectSelect.bind(this,index)} value={JSON.stringify(this.state.dataSource[index]['project'])||''}>
                    {
                    	this.state.projecttrees
                    }
                </Select>
            ),
		}, {
			title: '单位工程',
			dataIndex:'unit',
            render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.unitSelect.bind(this,index)} value={JSON.stringify(this.state.dataSource[index]['unit'])||''}>
                    {
                    	this.state.units[index]
                    }
                </Select>
            ),
		}, {
            title: '施工单位',
            dataIndex: 'construct_unit',
		}, {
			title: '施工图工程量',
            dataIndex: 'quantity',
		}, {
			title: '实际工程量',
            dataIndex: 'factquantity',
		}, {
			title: '计划开始时间',
            dataIndex: 'planstarttime',
		}, {
			title: '计划结束时间',
            dataIndex: 'planovertime',
		}, {
			title: '实际开始时间',
            dataIndex: 'factstarttime',
		}, {
			title: '实际结束时间',
            dataIndex: 'factovertime',
		}, {
            title: '上传人',
            dataIndex: 'uploads'
        },{
            title:'操作',
            render:(text,record,index) => {
                return  (
                    <Popconfirm
                        placement="leftTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                )
            }
        }];
		let jthis = this
		//上传
		const props = {
			action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
			headers: {
			},
			showUploadList: false,
		    onChange(info) {
		        if (info.file.status !== 'uploading') {
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    let {dataSource} = jthis.state
                    dataSource = jthis.handleExcelData(importData)
                    jthis.setState({dataSource})
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
		return (
			<Modal
            title="施工进度信息上传表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={true}
			onCancel={this.props.oncancel}
			>
				<div>
					<Button style={{margin:'10px 10px 10px 0px'}} type="primary">模板下载</Button>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
					 bordered 
					 columns={columns}
					 rowKey='key' 
                     dataSource={this.state.dataSource}
					/>
					<Upload {...props}>
	                    <Button style={{margin:'10px 10px 10px 0px'}}>
	                        <Icon type="upload" />上传附并预览
	                    </Button>
	                </Upload>
					<span>
                        审核人：
                        <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                this.state.checkers
                            }
                        </Select>
                    </span> 
				</div>
				<div style={{marginTop:20}}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
			</Modal>
		);
	}
	projectSelect(index,value) {
		let val = JSON.parse(value)
		const {actions: {getProjectTreeDetail}} = this.props;
		const {units} = this.state;
        let {dataSource} = this.state;
        dataSource[index].project = val;
        this.forceUpdate();
		getProjectTreeDetail({pk:val.pk},{depth:1})
		.then(res => {
			units[index] = res.children.map((o,index) => {
                return (
                    <Option key={index} value={JSON.stringify({pk:o.pk,name:o.name,code:o.code,obj_type:o.obj_type,})}>{o.name}</Option>
                )
            })
            this.setState({units})
		})

	}
	unitSelect(index,value) {
		let val = JSON.parse(value)
        let {dataSource} = this.state;
        dataSource[index].unit = val;
        this.forceUpdate();
	}
     //删除
    delete(index){
        let {units,projecttrees} = this.state;
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        units.splice(index,1);
        projecttrees.splice(index,1);
        this.setState({units,projecttrees})
    }
    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }
	covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
	onok(){
        let {dataSource} = this.state;
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.props.onok(this.state.dataSource,per)
    }

    //处理上传excel的数据
    handleExcelData(data){
        data.splice(0,1);
        let res = data.map((item,index) => {
            return {
                key:index+1,
                code:item[0],
                name:item[1],
                construct_unit:item[2],
                quantity:item[3],
                factquantity:item[4],
                planstarttime:item[5],
                planovertime:item[6],
                factstarttime:item[7],
                factovertime:item[8],
                uploads:getUser().username,
            }
        })
        return res
    }

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
