import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import Card from '_platform/components/panels/Card';
import {getNextStates} from '_platform/components/Progress/util';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE} from '_platform/api';
import {getUser} from '_platform/auth';
const Option = Select.Option;
var moment = require('moment');

export default class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			units:[],
			projecttrees: [],
			checkers: [],
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
		const { addition = {}, actions: { changeAdditionField } } = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			render:(text,record,index) => {
				return index+1
			}
		}, {
			title: '文档编码',
			dataIndex: 'code'
		}, {
			title: '文档名称',
			dataIndex: 'name'
		}, {
			title: '项目/子项目名称',
			dataIndex:'project',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.projectSelect.bind(this,index)} value={JSON.stringify(addition.dataSource[index]['project'])||''}>
                    {
                    	this.state.projecttrees
                    }
                </Select>
            ),
		}, {
			title: '单位工程',
			dataIndex:'unit',
            render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.unitSelect.bind(this,index)} value={JSON.stringify(addition.dataSource[index]['unit'])||''}>
                    {
                    	this.state.units[index]
                    }
                </Select>
            ),
		}, {
			title: '项目阶段',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,index,'stage')} value={addition.dataSource[index]['stage']}>
                    <Option value="初设阶段">初设阶段</Option>
                    <Option value="施工图阶段">施工图阶段</Option>
                    <Option value="竣工阶段">竣工阶段</Option>
                </Select>
            ),
		}, {
			title: '提交单位',
			dataIndex: 'upunit'
		}, {
			title: '文档类型',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,index,'filetype')} value={addition.dataSource[index]['filetype']}>
                    <Option value="图纸">图纸</Option>
                    <Option value="报告">报告</Option>
                </Select>
            ),
		}, {
			title: '专业',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,index,'major')} value={addition.dataSource[index]['major']}>
                    <Option value="建筑">建筑</Option>
                    <Option value="结构">结构</Option>
                </Select>
            ),
		}, {
			title: '描述的WBS对象',
			dataIndex: 'wbsObject'
		}, {
			title: '描述的设计对象',
			dataIndex: 'designObject'
		}, {
            title: '上传人',
            dataIndex: 'upPeople'
        }, {
            title:'附件',
			render:(text,record,index) => {
				if(record.file.id){
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, index)}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
				        </span>)
                }else{
                    return (
                        <span>
                        <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,index)}>
                            <Button>
                                <Icon type="upload" />上传附件
                            </Button>
                        </Upload>
                    </span>
                    )
                }
			}
        }, {
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
		            console.log(info.file, info.fileList);
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    console.log(importData);
                    changeAdditionField('dataSource',jthis.handleExcelData(importData))
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
		return (
			<Modal
			 key={addition.key}
			 title="设计信息上传表"
			 width={1280}
			 visible={addition.visible}
			 maskClosable={false}
			 onCancel={this.cancel.bind(this)}
             footer={null}
			>
				<div>
					<Button style={{margin:'10px 10px 10px 0px'}} type="primary">模板下载</Button>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
					 bordered 
					 columns={columns}
					 rowKey='index' 
					 dataSource={addition.dataSource}
					/>
					<Upload {...props}>
	                    <Button style={{margin:'10px 10px 10px 0px'}}>
	                        <Icon type="upload" />上传附件
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
                    <Button className="btn" type="primary" onClick={this.onok.bind(this)}>提交</Button>
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
		console.log(value)
		let val = JSON.parse(value)
		const {actions: {getProjectTreeDetail}} = this.props;
		const {units} = this.state;
		const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
		dataSource[index].project = val;
		changeAdditionField('dataSource',dataSource)
		getProjectTreeDetail({pk:val.pk},{depth:1})
		.then(res => {
			units[index] = res.children.map((o,index) => {
                return (
                    <Option key={index} value={JSON.stringify({pk:o.pk,name:o.name})}>{o.name}</Option>
                )
            })
            this.setState({units})
		})

	}
	unitSelect(index,value) {
		console.log(value)
		let val = JSON.parse(value)
		const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
        dataSource[index].unit = val;
        changeAdditionField('dataSource',dataSource)
	}
	//table input 输入
    tableDataChange(index, key , e){
		const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
		dataSource[index][key] = e.target['value'];
	  	changeAdditionField('dataSource',dataSource)
    }
    //下拉框选择变化
    handleSelect(index,key,value){
        const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
		dataSource[index][key] = value;
	  	changeAdditionField('dataSource',dataSource)
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        const fileName = file.name;
        const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
        let temp = fileName.split(".")[0]
        //判断有无重复
        // if(dataSource.some(o => {
        //    return o.code === temp
        // })){
        //     message.info("该附件已经上传过了")
        //     return false
        // }
		// 上传到静态服务器
		const { actions:{uploadStaticFile} } = this.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
                     //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            resp = await resp.json()
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
				//thumbUrl: SOURCE_API + resp.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type
            };
            let jcode = file.name.split('.')[0]
            //let info = await this.getInfo(jcode)
            dataSource[index]['file'] = attachment
            dataSource[index]['name'] = fileName
            //dataSource[index] = Object.assign(dataSource[index],info)
            changeAdditionField('dataSource',dataSource)
		});
		return false;
    }
     //删除
    delete(index){
        const { addition,actions:{changeAdditionField} } = this.props;
        let {units,projecttrees} = this.state;
        let {dataSource} = addition;
        dataSource.splice(index,1);
        units.splice(index,1);
        projecttrees.splice(index,1);
        changeAdditionField('dataSource',dataSource)
        this.setState({units,projecttrees})
    }
    //附件删除
    remove(index){
        const {actions:{deleteStaticFile}} = this.props
        const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
        let id = dataSource[index]['file'].id;
        deleteStaticFile({id:id});

        dataSource[index].file = '';
        changeAdditionField('dataSource',dataSource)
    }
    // //根据附件名称 也就是wbs编码获取其他信息
    // async getInfo(code){
    //     console.log(this.props)
    //     let res = {};
    //     const {actions:{getWorkPackageDetail}} = this.props
    //     let jianyanpi = await getWorkPackageDetail({code:code})
    //     res.name = jianyanpi.name
    //     res.code = jianyanpi.code        
    //     let fenxiang = await getWorkPackageDetail({code:jianyanpi.parent.code})
    //     if(fenxiang.parent.obj_type_hum === "子分部工程"){
    //         let zifenbu = await getWorkPackageDetail({code:fenxiang.parent.code})
    //         let fenbu =  await getWorkPackageDetail({code:zifenbu.parent.code})
    //         let zidanwei = {},danwei = {};
    //         if(fenbu.parent.obj_type_hum === "子单位工程"){
    //             zidanwei = await getWorkPackageDetail({code:fenbu.parent.code})
    //             danwei =  await getWorkPackageDetail({code:zidanwei.parent.code})
                
    //         }else{
    //             danwei = await getWorkPackageDetail({code:fenbu.parent.code})
    //         } 
    //         let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
    //         res.construct_unit = construct_unit
    //         res.unit = {
    //             name:danwei.name,
    //             code:danwei.code,
    //             obj_type:danwei.obj_type
    //         }
    //         res.project = danwei.parent
    //     }else{
    //         let fenbu = await getWorkPackageDetail({code:fenxiang.parent.code})
    //         let zidanwei = {},danwei = {};
    //         if(fenbu.parent.obj_type_hum === "子单位工程"){
    //             zidanwei = await getWorkPackageDetail({code:fenbu.parent.code})
    //             danwei =  await getWorkPackageDetail({code:zidanwei.parent.code})
                
    //         }else{
    //             danwei = await getWorkPackageDetail({code:fenbu.parent.code})
    //         } 
    //         let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
    //         res.construct_unit = construct_unit
    //         res.unit = {
    //             name:danwei.name,
    //             code:danwei.code,
    //             obj_type:danwei.obj_type
    //         }
    //         res.project = danwei.parent
    //     }
    //     return res
    // }
    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }
    //预览
    handlePreview(index){
        const {addition:{dataSource},actions: {openPreview}} = this.props;
        let f = dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
	covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
	onok(){
		const { addition,actions:{changeAdditionField} } = this.props;
        let {dataSource} = addition;
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        let temp = dataSource.some((o,index) => {
            return !o.file.id
        })
        if(temp){
            message.info(`有数据未上传附件`)
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
		this.setData(dataSource,per)
    }
	//批量上传回调
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent,clearAdditionField }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"设计信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"设计信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
            {
                state:rst.current[0].id,
                action:'提交',
                note:'发起填报',
                executor:creator,
                next_states:[{
                    participants:[participants],
                    remark:"",
                    state:nextStates[0].to_state[0].id,
                }],
                attachment:null
            }).then(() => {
                message.success("成功")
				clearAdditionField();
			})
		})
	}

    //处理上传excel的数据
    handleExcelData(data){
        data.splice(0,1);
        let res = data.map((item,index) => {
            return {
                code:item[0],
                name:'',
                stage:item[1],
                upunit:item[2],
                filetype:item[3],
                major:item[4],
                wbsObject:item[5],
                designObject:item[6],
                file:'',
                upPeople:getUser().username,
            }
        })
        return res
    }

	cancel() {
		const {
			actions: { clearAdditionField }
		} = this.props;
		clearAdditionField();
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
