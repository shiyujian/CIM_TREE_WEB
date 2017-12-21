import React, { Component } from 'react';

import { Input, Table, Row, Button, DatePicker, Radio, Select, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select

class PriceList extends Component {

	constructor(props) {
		super(props);
		this.state = {
            dataSource:[],
            checkers:[],//审核人下来框选项
            check:null,//审核人
		};
    }
    componentDidMount(){
        const {actions:{getAllUsers}} = this.props
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
    }
	
	//ok
	onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(this.state.dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        // let temp = this.state.dataSource.some((o,index) => {
        //                 return !o.file.id
        //             })
        // if(temp){
        //     message.info(`有数据未上传附件`)
        //     return
        // }
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
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        const fileName = file.name;
        let {dataSource} = this.state
        let temp = fileName.split(".")[0]
        //判断有无重复
        if(dataSource.some(o => {
           return o.code === temp
        })){
            message.info("该检验批已经上传过了")
            return false
        }
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
            let info = await this.getInfo(jcode)
            dataSource[index]['file'] = attachment
            dataSource[index] = Object.assign(dataSource[index],info)
            this.setState({dataSource})
		});
		return false;
    }
    //附件删除
    remove(index){
        const {actions:{deleteStaticFile}} = this.props
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
            projectcoding:{
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
    //根据附件名称 也就是wbs编码获取其他信息
    async getInfo(code){
        console.log(this.props)
        let res = {};
        const {actions:{getWorkPackageDetail}} = this.props
        let pricelist = await getWorkPackageDetail({code:code})
        res.name = pricelist.name
        res.code = pricelist.code        
        let fenxiang = await getWorkPackageDetail({code:pricelist.parent.code})
        if(fenxiang.parent.obj_type_hum === "子分部工程"){
            let zifenbu = await getWorkPackageDetail({code:fenxiang.parent.code})
            let fenbu =  await getWorkPackageDetail({code:zifenbu.parent.code})
            let zidanwei = {},danwei = {};
            if(fenbu.parent.obj_type_hum === "子单位工程"){
                zidanwei = await getWorkPackageDetail({code:fenbu.parent.code})
                danwei =  await getWorkPackageDetail({code:zidanwei.parent.code})
                
            }else{
                danwei = await getWorkPackageDetail({code:fenbu.parent.code})
            } 
            let construct_unit = danwei.extra_params.projectcoding.find(i => i.type === "施工单位")
            res.construct_unit = construct_unit
            res.projectcoding = {
                name:danwei.name,
                code:danwei.code,
                obj_type:danwei.obj_type
            }
            res.project = danwei.parent
        }else{
            let fenbu = await getWorkPackageDetail({code:fenxiang.parent.code})
            let zidanwei = {},danwei = {};
            if(fenbu.parent.obj_type_hum === "子单位工程"){
                zidanwei = await getWorkPackageDetail({code:fenbu.parent.code})
                danwei =  await getWorkPackageDetail({code:zidanwei.parent.code})
                
            }else{
                danwei = await getWorkPackageDetail({code:fenbu.parent.code})
            } 
            let construct_unit = danwei.extra_params.projectcoding.find(i => i.type === "施工单位")
            res.construct_unit = construct_unit
            res.projectcoding = {
                name:danwei.name,
                code:danwei.code,
                obj_type:danwei.obj_type
            }
            res.project = danwei.parent
        }
        return res
    }
    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }
    //删除
    delete(index){
        let {dataSource} = this.state
        dataSource.splice(index,1)
        this.setState({dataSource})
    }
	render() {
        const columns = 
        [{
            title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title: '单位工程',
			dataIndex: 'unitproject',
		  },{
			title: '工作节点目标',
			dataIndex: 'nodetarget',
		  },{
			title: '完成时间',
			dataIndex: 'completiontime',
		  },{
			title: '支付金额（万元）',
			dataIndex: 'summoney',
		  },{
			title: '累计占比',
			dataIndex: 'ratio',
		  },{
			title: '备注',
			dataIndex: 'remarks',
		  },{
            title:'编辑',
            dataIndex:'edit',
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
        }]
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
		            message.success(`${info.file.name} 文件上传成功`);
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
		};
		return (
			<Modal
			title="计价清单信息上传表"
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
				<div>
                <h1 style ={{textAlign:'center',marginBottom:20}}>结果预览</h1>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
						columns={columns}
						dataSource={this.state.dataSource}
						bordered />
                    <Button style={{margin:'10px 10px 10px 0px'}} type="primary">模板下载</Button>
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
		)
    }
    //处理上传excel的数据
    handleExcelData(data){
        data.splice(0,1);
        let res = data.map(item => {
            return {
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
            unitproject:item[1],
            nodetarget:item[2],
            completiontime:item[3],
            summoney:item[4],
            ratio:item[5],
            remarks:item[6],
            edit:item[7],
                file:{

                }
            }
        })
        return res
    }
}
export default PriceList