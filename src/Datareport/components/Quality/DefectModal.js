import React, {Component} from 'react';

import {Input, Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
import '../../containers/quality.less'
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select

class DefectModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource:[]
		};
	}
	//table input 输入
    tableDataChange(index, key ,e ){
		const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
	  	this.setState({dataSource});
    }
    //下拉框选择变化
    handleSelect(index,key,value){
        const { dataSource } = this.state;
		dataSource[index][key] = value;
	  	this.setState({dataSource});
    }
	//ok
	onok(){
		this.props.onok(this.state.dataSource)
    }
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        debugger
		const fileName = file.name;
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
            const attachment = [{
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
				//thumbUrl: SOURCE_API + resp.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type
            }];
            let jcode = file.name.split('.')[0]
            let info = await this.getInfo(jcode)
            let {dataSource} = this.state
            dataSource[index]['file'] = attachment
            dataSource[index]['file'] = Object.assign(dataSource[index]['file'],info)
            this.setState({dataSource})
		});
		return false;
    }
    //附件删除
    remove(index){
        const {actions:deleteStaticFile} = this.props
        let {dataSource} = this.state
        let id = dataSource[index]['file'].id
        deleteStaticFile({id:id})
        let rate = dataSource[index].rate
        let level = dataSource[index].level
        dataSource[index] = {
            rate:rate,
            level:level,
            name:"",
            project:{
                code:"",
                name:"",
                obj_type:""
            },
            unit:{
                code:"",
                name:"",
                obj_type:""
            },
            construct_unit:{
                code:"",
                name:"",
                type:"",
            },
            file:{
            }
        }
        this.setState({dataSource})
    }
    //重新编码出错，重新获取
    dofix(index){
        alert(index)
    }
	render() {
        let columns = [{
            title:'序号',
            width:'5%',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title:'项目/子项目名称',
            dataIndex:'project',
            width:'8%',
            render: (text, record, index) => (
                record.name
            ),
		},{
			title:'单位工程',
            dataIndex:'unit',
            width:'8%',
            render: (text, record, index) => (
                record.name
            ),
		},{
			title:'WBS编码',
            dataIndex:'code',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['code']} onBlur={this.dofix.bind(this,index)} onChange={this.tableDataChange.bind(this,index,'code')}/>
            ),
		},{
			title:'责任单位',
            dataIndex:'respon_unit',
            width:'8%',
            render: (text, record, index) => (
                record.name
            ),
		},{
			title:'事故类型',
            dataIndex:'acc_type',
            width:'8%',
            render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,index,'acc_type')} value={this.state.dataSource[index]['acc_type']}>
                    <Option value="一般质量事故">一般质量事故</Option>
                    <Option value="严重质量事故">严重质量事故</Option>
                    <Option value="重大质量事故">重大质量事故</Option>
                </Select>
            ),
		},{
			title:'上报时间',
            dataIndex:'uploda_date',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['uploda_date']} onChange={this.tableDataChange.bind(this,index,'uploda_date')}/>
            ),
		},{
			title:'核查时间',
            dataIndex:'check_date',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['check_date']} onChange={this.tableDataChange.bind(this,index,'check_date')}/>
            ),
		},{
			title:'整改时间',
            dataIndex:'do_date',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['do_date']} onChange={this.tableDataChange.bind(this,index,'do_date')}/>
            ),
		},{
			title:'事故描述',
            dataIndex:'descrip',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['descrip']} onChange={this.tableDataChange.bind(this,index,'descrip')}/>
            ),
		},{
			title:'排查结果',
            dataIndex:'check_result',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['check_result']} onChange={this.tableDataChange.bind(this,index,'check_result')}/>
            ),
		},{
			title:'整改期限',
            dataIndex:'deadline',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['deadline']} onChange={this.tableDataChange.bind(this,index,'deadline')}/>
            ),
		},{
			title:'整改结果',
            dataIndex:'result',
            width:'8%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['result']} onChange={this.tableDataChange.bind(this,index,'result')}/>
            ),
		}, {
            title:'附件',
            width:'5%',
			render:(text,record,index) => {
				return <span>
					<a>预览</a>
					<span className="ant-divider" />
					<a>下载</a>
				</span>
			}
		},{
            title:'操作',
            width:'3%',
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
                    let {dataSource} = jthis.state
                    dataSource = jthis.handleExcelData(importData)
                    jthis.setState({dataSource}) 
		            message.success(`${info.file.name} file uploaded successfully`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
		return (
			<Modal
			title="检验批信息上传表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
				<div>
                    <Button style={{margin:'10px 10px 10px 0px'}} type="primary">模板下载</Button>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
						columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{y:500}}
						bordered />
                    <Upload {...props}>
                        <Button style={{margin:'10px 10px 10px 0px'}}>
                            <Icon type="upload" />上传附件
                        </Button>
                    </Upload>
                    <Button className="btn" type="primary">提交</Button>
				</div>
                <div style={{marginTop:20}}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
			</Modal>
		)
    }
    //处理上传excel的数据
    handleExcelData(data){
        data.splice(0,1);
        let res = data.map(item => {
            return {
                code:item[2],
                acc_type:item[4],
                uploda_date:item[5],
                check_date:item[6],
                do_date:item[7],
                descrip:item[8],
                check_result:item[9],
                deadline:item[10],
                result:item[11],
                project:{
                    code:"",
                    name:item[0],
                    obj_type:""
                },
                respon_unit:{
                    code:"",
                    name:item[3],
                    obj_type:""
                },
                unit:{
                    code:"",
                    name:item[1],
                    type:"",
                },
                file:{

                }
            }
        })
        return res
    }
}
export default DefectModal