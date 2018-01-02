import React, {Component} from 'react';

import {Input, Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message,Cascader} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less'
import Preview from '_platform/components/layout/Preview';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select

class DefectModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
            dataSource:[],
            options:[],
            checkers:[],
            check:null,
            project:{},
            unit:{}
		};
    }
    componentDidMount(){
        const {actions:{getAllUsers,getProjectTree}} = this.props
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
        // getProjectTree({depth:1}).then(rst =>{
        //     if(rst.status){
        //         let projects = rst.children.map(item=>{
        //             return (
        //                 {
        //                     value:JSON.stringify(item),
        //                     label:item.name,
        //                     isLeaf:false
        //                 }
        //             )
        //         })
        //         this.setState({options:projects});
        //     }else{
        //         //获取项目信息失败
        //     }
        // });
    }
     // 也就是wbs编码获取其他信息
     async getInfo(wp){
        let res = {};
        const {actions:{getWorkPackageDetail}} = this.props
        res.name = wp.name
        res.code = wp.code  
        let dwcode = ""
        let getUnitLoop = async(param) => {
            let next = {};
            switch (param.obj_type_hum){
                case "单元工程":
                    next = await getWorkPackageDetail({code:param.parent.code})
                    await getUnitLoop(next)
                    break;
                case "分项工程":
                    next = await getWorkPackageDetail({code:param.parent.code})
                    await getUnitLoop(next)
                    break;
                case "子分部工程":
                    next = await getWorkPackageDetail({code:param.parent.code})
                    await getUnitLoop(next)
                    break;
                case "分部工程":
                    next = await getWorkPackageDetail({code:param.parent.code})
                    await getUnitLoop(next)
                    break;
                case "子单位工程":
                    dwcode = param.parent.code
                    break
                case "单位工程":
                    dwcode = param.code
                    break
                default:break;
            } 
        }
        await getUnitLoop(wp)
        let danwei = await getWorkPackageDetail({code:dwcode})
        let respon_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
        res.respon_unit = respon_unit
        res.unit = {
            name:danwei.name,
            code:danwei.code,
            obj_type:danwei.obj_type
        }
        res.project = danwei.parent
        return res
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
		if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(this.state.dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        let temp = this.state.dataSource.some((o,index) => {
                        return !o.flag
                    })
        if(temp){
            message.info(`有数据不正确`)
            return
        }
        if(this.state.dataSource.some((o,index) => {
            return !o.file.name
        })){
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
		this.props.onok(this.state.dataSource,per)
    }
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        let {dataSource} = this.state        
        if(!dataSource[index].flag){
            message.info("这条数据编码不对")
            return false
        }
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
            dataSource[index]['file'] = attachment
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
        dataSource[index]['file'] = {}
        this.setState({dataSource})
    }
    //删除
    delete(index){
        let {dataSource} = this.state
        dataSource.splice(index,1)
        this.setState({dataSource})
    }
    //编码错了修复
    async getFixed(i){
        let {dataSource} = this.state
        let record = dataSource[i]
        if(dataSource[i].flag){
            return
        }
        let tmp = dataSource[i].file.name ? true : false
        const {actions:{getWorkPackageDetail}} = this.props
        let fenbu = await getWorkPackageDetail({code:record.code})
        let obj = {}
        let flag = false
        if(fenbu.name){
            obj = await this.getInfo(fenbu)
            flag = true && tmp
            dataSource[i].project = obj.project
            dataSource[i].unit = obj.unit
            dataSource[i].respon_unit = obj.respon_unit
            dataSource[i].flag = flag
        }else{
            message.info("输入编码值还是有误")
        }
        this.setState({dataSource})
    }
    // loadData = (selectedOptions) =>{
    //     const {actions:{getProjectTree}} = this.props;
    //     const targetOption = selectedOptions[selectedOptions.length - 1];
    //     targetOption.loading = true;
    //     getProjectTree({depth:2}).then(rst =>{
    //         if(rst.status){
    //             let units = [];
    //             rst.children.map(item=>{
    //                 if(item.code===JSON.parse(targetOption.value).code){  //当前选中项目
    //                     units = item.children.map(unit =>{
    //                         return (
    //                             {
    //                                 value:JSON.stringify(unit),
    //                                 label:unit.name
    //                             }
    //                         )
    //                     })
    //                 }
    //             })
    //             targetOption.loading = false;
    //             targetOption.children = units;
    //             this.setState({options:[...this.state.options]})
    //         }else{
    //             //获取项目信息失败
    //         }
    //     });
    // }
     //预览
     handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }
    //级联下拉框选择
    // onSelectProject = (value,selectedOptions) =>{
    //     let project = {};
    //     let unit = {};
    //     if(value.length===2){
    //         let temp1 = JSON.parse(value[0]);
    //         let temp2 = JSON.parse(value[1]);
    //         project = {
    //             name:temp1.name,
    //             code:temp1.code,
    //             obj_type:temp1.obj_type
    //         }
    //         unit = {
    //             name:temp2.name,
    //             code:temp2.code,
    //             obj_type:temp2.obj_type
    //         }
    //         this.setState({project,unit});
    //         return;
    //     }
    //     //must choose all,otherwise make it null
    //     this.setState({project:{},unit:{}});
    // }
	render() {
        let columns = [{
            title:'序号',
            width:'4%',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title:'项目/子项目名称',
            dataIndex:'project',
            width:'7%',
            render: (text, record, index) => {
                if(record.flag){
                    return <span style={{color:'green'}}>{record.project ? record.project.name : ''}</span>
                }else{
                    return <span style={{color:'red'}}>{record.project ? record.project.name : ''}</span>
                }
            },
		},{
			title:'单位工程',
            dataIndex:'unit',
            width:'7%',
            render: (text, record, index) => {
                if(record.flag){
                    return (<span style={{color:'green'}}>{record.unit ? record.unit.name : ''}</span>)
                }else{
                    return (<span style={{color:'red'}}>{record.unit ? record.unit.name : ''}</span>)
                }
            },
		},{
			title:'WBS编码',
            dataIndex:'code',
            width:'5%',
            render: (text, record, index) => (
                <Input onBlur={this.getFixed.bind(this,index)} value={this.state.dataSource[index]['code']} onChange={this.tableDataChange.bind(this,index,'code')}/>
            ),
		},{
			title:'责任单位',
            dataIndex:'respon_unit',
            width:'7%',
            render: (text, record, index) => {
                if(record.flag){
                    return <span style={{color:'green'}}>{record.respon_unit ? record.respon_unit.name : ''}</span>
                }else{
                    return <span style={{color:'red'}}>{record.respon_unit ? record.respon_unit.name : ''}</span>
                }
            }
		},{
			title:'事故类型',
            dataIndex:'acc_type',
            width:'7%',
            render: (text, record, index) => (
                <Select style={{width:'80px'}} onSelect={this.handleSelect.bind(this,index,'acc_type')} value={this.state.dataSource[index]['acc_type']}>
                    <Option value="一般质量事故">一般质量事故</Option>
                    <Option value="严重质量事故">严重质量事故</Option>
                    <Option value="重大质量事故">重大质量事故</Option>
                </Select>
            ),
		},{
			title:'上报时间',
            dataIndex:'uploda_date',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['uploda_date']} onChange={this.tableDataChange.bind(this,index,'uploda_date')}/>
            ),
		},{
			title:'核查时间',
            dataIndex:'check_date',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['check_date']} onChange={this.tableDataChange.bind(this,index,'check_date')}/>
            ),
		},{
			title:'整改时间',
            dataIndex:'do_date',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['do_date']} onChange={this.tableDataChange.bind(this,index,'do_date')}/>
            ),
		},{
			title:'事故描述',
            dataIndex:'descrip',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['descrip']} onChange={this.tableDataChange.bind(this,index,'descrip')}/>
            ),
		},{
			title:'排查结果',
            dataIndex:'check_result',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['check_result']} onChange={this.tableDataChange.bind(this,index,'check_result')}/>
            ),
		},{
			title:'整改期限',
            dataIndex:'deadline',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['deadline']} onChange={this.tableDataChange.bind(this,index,'deadline')}/>
            ),
		},{
			title:'整改结果',
            dataIndex:'result',
            width:'7%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['result']} onChange={this.tableDataChange.bind(this,index,'result')}/>
            ),
		}, {
            title:'附件',
            width:'10%',
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
		},{
            title:'操作',
            width:'5%',
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
		    async onChange(info) {
		        if (info.file.status !== 'uploading') {
		            console.log(info.file, info.fileList);
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    console.log(importData);
                    let {dataSource} = jthis.state
                    dataSource = jthis.handleExcelData(importData)
                    await jthis.setState({dataSource})
                    dataSource.map((o,i) => {
                        jthis.getFixed(i)
                    })
		            message.success("上传成功");
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
			maskClosable={true}
			onCancel={this.props.oncancel}>
				<div>
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
                    {/* <span>
                        项目-单位工程：
                        <Cascader
                            options={this.state.options}
                            className='btn'
                            loadData={this.loadData.bind(this)}
                            onChange={this.onSelectProject.bind(this)}
                            changeOnSelect
                        />
                    </span>  */}
                    <span>
                        审核人：
                        <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                this.state.checkers
                            }
                        </Select>
                    </span> 
                    <Preview/>
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
        const {actions:{getWorkPackageDetail}} = this.props
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

                },
            }
        })
        return res
    }
}
export default DefectModal