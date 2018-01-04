import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification, DatePicker} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, DataReportTemplate_ValuationList} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import EditableCell from '../EditableCell';

const {Option} = Select

export default class PriceList extends Component {

	constructor(props) {
		super(props);
		this.state = {
            dataSource:[],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:[],
            concatunit:{},
            options:[],
            unit:{},
            alreadyChange: false
        };
    }
    componentDidMount(){

        const {actions:{getAllUsers,getWorkflowById,getProjectTree}} = this.props;
        getAllUsers().then(res => {
            let checkers = res.map((o,index) => {
                return (
                    <Option value={JSON.stringify(o)}  key={index+1}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        });
        getProjectTree({depth:1}).then(rst => {
            if (rst.status) {
                let projects = rst.children.map((item, key) => {
                    return (
                        {
                            value:JSON.stringify(item),
                            label:item.name,
                            isLeaf:false,
                            key
                        }
                    )
                })
                this.setState({options:projects})
            }else{
                //获取项目信息失败
            };
        })
    }
	beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    uplodachange = async(info) => {
        let {actions: {verifyCode}} = this.props;
        //info.file.status/response
        if (info && info.file && info.file.status === 'done') {
            notification.success({
                message: '上传成功！',
                duration: 2
            });
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let dataSource = [];
            for (let i = 1; i < dataList.length; i++) {
                let res = await verifyCode({code: dataList[i][0]});
                dataList[i].flag = res !== 'object not found' ? true : false;
                dataSource.push({
                    code: dataList[i][0] ? dataList[i][0] : '',
                    filename: dataList[i][0] ? dataList[i][0] : '',
                    projectcoding: dataList[i][0] ? dataList[i][0] : '',
                    valuation: dataList[i][1] ? dataList[i][1] : '',
                    rate: dataList[i][2] ? dataList[i][2] : '',
                    company: dataList[i][3] ? dataList[i][3] : '',
                    total: dataList[i][4] ? dataList[i][4] : '',
                    remarks: dataList[i][5] ? dataList[i][5] : '',
                    flag: dataList[i].flag,
                    project:{
                        code:"",
                        name:"",
                        obj_type:""
                    },
                    unit:{
                        code:"",
                        name:"",
                        obj_type:"",
                        pk: ""
                    },
                    key: i
                })
                // if(uniq(dataSource.map(item=>code)).length)
            }
            if(dataSource.some(item => {
                return item.flag
            })) {
                notification.warning({
                    message:'清单项目编码错误',
                    duration: 2
				});
            }
            dataSource = this.checkCodeRepeat(dataSource);
            this.setState({ dataSource, percent: 100, loading: false });
        }
    }

    checkCodeRepeat(dataSource) {
        let codearr = dataSource.map(data => data.projectcoding);
        let repeatFlag = false;
        for(var i = 0, l = codearr.length; i < l; ++i) {
            if (codearr.indexOf(codearr[i]) !== i) {
                if(!dataSource[i].flag) {
                    dataSource[i].flag = true;
                    repeatFlag = true;
                }
            }
        }
        repeatFlag && notification.warning({
            message:'清单项目编码重复',
            duration: 2
        });
        return dataSource;
    }

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }

    onSelectProject = (value,selectedOptions) =>{
        let project = {};
        let unit = {};
        if(value.length===2){
            let temp1 = JSON.parse(value[0]);
            let temp2 = JSON.parse(value[1]);
            project = {
                name:temp1.name,
                code:temp1.code,
                obj_type:temp1.obj_type
            }
            unit = {
                name:temp2.name,
                code:temp2.code,
                obj_type:temp2.obj_type
            }
            this.setState({project,unit});
            return;
        }
        //must choose all,otherwise make it null
        this.setState({project:{},unit:{}});
    }

    loadData = (selectedOptions) =>{
        const {actions:{getProjectTree}} = this.props;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getProjectTree({depth:2}).then(rst =>{
            if(rst.status){
                let units = [];
                rst.children.map(item=>{
                    if(item.code===JSON.parse(targetOption.value).code){  //当前选中项目
                        units = item.children.map(unit =>{
                            return (
                                {
                                    value:JSON.stringify(unit),
                                    label:unit.name
                                }
                            )
                        })
                    }
                })
                targetOption.loading = false;
                targetOption.children = units;
                this.setState({options:[...this.state.options]})
            }else{
                //获取项目信息失败
            }
        });
    }
	//ok
	onok(){
        if(!this.state.dataSource.length) {
            notification.warning({
                message:'数据不能为空',
                duration: 2
            });
            return
        }
        if(!this.state.check){
            notification.warning({
                message:'请选择审核人',
                duration: 2
            });
            return
        }
        if(this.state.dataSource.length === 0){
            notification.warning({
                message:'请上传excel',
                duration: 2
            });
            return
        }
        let flag = this.state.dataSource.some((o,index) => {
            return o.flag
        })
        if(flag) {
            notification.warning({
                message:'清单项目编码错误',
                duration: 2
            });
            return
        }
        const {project,unit} =  this.state;
        if(!project.name){
            notification.warning({
                message:'请选择项目和单位工程',
                duration: 2
            });
            return;
        }
		let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
        for(let i=0;i<this.state.dataSource.length;i++){
            this.state.dataSource[i].project = project;
            this.state.dataSource[i].unit = unit;
        }
		this.props.onok(this.state.dataSource,per)
    }
    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource = dataSource.filter(item => item.key != index);
        this.setState({dataSource})
    }

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

    //附件删除
    remove(index){
        const {actions:{deleteStaticFile}} = this.props
        let {dataSource} = this.state
        let id = dataSource[index]['file'].id
        deleteStaticFile({id:id})
        let projectcoding = dataSource[index].projectcoding;
        let valuation = dataSource[index].valuation;
        let content = dataSource[index].content;
        let company = dataSource[index].company;
        let total = dataSource[index].total;
        let remarks = dataSource[index].remarks;
        dataSource[index] = {
            filename: '',
            projectcoding: projectcoding,
            valuation: valuation,
            content: content,
            company: company,
            total: total,
            remarks: remarks,
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
        this.setState({dataSource});
    }

    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        // 上传到静态服务器
        const fileName = file.name;
        let {dataSource,unit,project} = this.state;
        let temp = fileName.split(".")[0]
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
            if (!resp || !resp.id) {
                notification.error({
                    message:'文件上传失败',
                    duration: 2
                });
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
            let unitProject = {
                name:unit.name,
                code:unit.code,
                obj_type:unit.obj_type
            }
            let projectt = {
                name:project.name,
                code:project.code,
                obj_type:project.obj_type
            }
            dataSource[index]['file'] = attachment;
            dataSource[index]['unit'] = unitProject;
            dataSource[index]['project'] = projectt;
            this.setState({dataSource});
        });
        return false;
    }
    
    onCellChange = (index, key, record) => {      //编辑某个单元格
        this.state.alreadyChange = true;
        const { dataSource } = this.state;
        return (value) => {
            if(!isNaN(-value)) {
                value = +value
            }
            dataSource[index-1][key] = value;
            record[key] = value;
        };
    }
    //验证编码
    asyncVerify (index, key, record) {
        let {actions: {verifyCode}} = this.props;
        return async (code) => {
            if(!code.length){
                notification.warning({
                    message:'编码不能为空',
                    duration: 2
                });
                return;
            }
            debugger;
            const { dataSource } = this.state;
            let codeArr = dataSource.map(data => data[key]+'');
            codeArr[index-1] = code+'';
            if (codeArr.indexOf(code) !== codeArr.lastIndexOf(code)) {
                notification.warning({
                    message:'清单项目编码重复',
                    duration: 2
                });
            } else {
                let res = await verifyCode({code});
                if(res === 'object not found') {
                    dataSource[index-1].flag = false;
                }else {
                    notification.warning({
                        message:'清单项目编码错误',
                        duration: 2
                    });
                    dataSource[index-1].flag = true;
                }
            }
            this.setState({dataSource});
        }
        
    }

    edit (index) {
        const {dataSource} = this.state;
        dataSource[index].editable = true;
        this.setState({dataSource});
    }

    editOk (index, record) {
        let {dataSource} = this.state;
        dataSource[index].editable = false;
        this.setState({dataSource});
    }

    //下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	render() {
        let {dataSource} = this.state.dataSource;
        const columns = 
            [{
                title:'序号',
                dataIndex:'code',
                render:(text,record,index) => {
                    return record.key
                }
            },{
                title:'清单项目编码',
                dataIndex:'projectcoding',
                width:"10%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(record.flag || editable){
                        return (
                            <div style={{color:record.flag?'red':'green'}}>
                                <EditableCell
                                    value={record.projectcoding}
                                    editOnOff={false}
                                    onChange={this.onCellChange.call(this, record.key, "projectcoding", record)}
                                    asyncVerify={this.asyncVerify.call(this, record.key, "projectcoding", record)}
                                />
                            </div>
                        )
                    }else{
                        return <span style={{color:"green"}}>{record.projectcoding}</span>
                    }
                }
            },{
                title:'计价单项',
                dataIndex:'valuation',
                width:"10%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(editable) {
                        return <EditableCell
                            value={record.projectcoding}
                            editOnOff={false}
                            onChange={this.onCellChange.call(this, record.key, "valuation", record)}
                        />
                    } else {
                        return <span>{record.valuation}</span>
                    }
                }
            },{
                title:'工程内容/规格编号',
                dataIndex:'rate',
                width:"30%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(editable) {
                        return <EditableCell
                            value={record.rate}
                            editOnOff={false}
                            onChange={this.onCellChange.call(this, record.key, "rate", record)}
                        />
                    } else {
                        return <span>{record.rate}</span>
                    }
                }
            },{
                title:'计价单位',
                dataIndex:'company',
                width:"10%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(editable) {
                        return <EditableCell
                            value={record.company}
                            editOnOff={false}
                            onChange={this.onCellChange.call(this, record.key, "company", record)}
                        />
                    } else {
                        return <span>{record.company}</span>
                    }
                }
            },{
                title:'结合单价（元）',
                dataIndex:'total',
                width:"10%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(editable) {
                        return <EditableCell
                            value={record.total}
                            editOnOff={false}
                            onChange={this.onCellChange.call(this, record.key, "total", record)}
                        />
                    } else {
                        return <span>{record.total}</span>
                    }
                }
            },{
                title:'备注',
                dataIndex:'remarks',
                width:"10%",
                render: (text, record, index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    if(editable) {
                        return <EditableCell
                            value={record.remarks}
                            editOnOff={false}
                            onChange={this.onCellChange.call(this, record.key, "remarks", record)}
                        />
                    } else {
                        return <span>{record.remarks}</span>
                    }
                }
            },{
                title:'状态',
                dataIndex:'status',
                width:"10%",
                render: (text, record, index) => {
                    return <span>待提交</span>
                }
            },{
                title:'操作',
                width:"10%",
                dataIndex:'edit',
                render:(text,record,index) => {
                    let {dataSource} = this.state;
                    let editable = dataSource[record.key - 1].editable;
                    return !editable ? (
                        <div>
                            <a href="javascript:;" onClick={this.edit.bind(this,record.key-1)}><Icon style={{marginRight:"15px"}} type = "edit"/></a>
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.delete.bind(this, record.key)}
                                okText="确认"
                                cancelText="取消">
                                <a><Icon type = "delete"/></a>
                            </Popconfirm>
                        </div>
                    ): (
                        <a href="javascript:;" onClick={this.editOk.bind(this,record.key-1)}>完成</a>
                      );
                }
            }];
		return (
			<Modal
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
                <div>
                <h1 style ={{textAlign:'center',marginBottom:20}}>发起填报</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{showQuickJumper:true,showSizeChanger:true,total:this.state.dataSource.length}} 
                />
                <Row >
                    {
                        this.state.dataSource.length && 
                        <Col span={3} push={12} style={{ position: 'relative', top: -40, fontSize: 12 }}>
                            [共：{this.state.dataSource.length}行]
                        </Col>
                    }
                </Row>
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ margin:'10px 10px 10px 0px' }}  onClick={() => this.createLink('downLoadTemplate', DataReportTemplate_ValuationList)}>模板下载</Button></Col>
                    <Col>
                        <Upload
                            onChange={this.uplodachange.bind(this)}
                            name='file'
                            showUploadList={false}
                            action={`${SERVICE_API}/excel/upload-api/`}
                            beforeUpload={this.beforeUpload.bind(this)}
                        >
                            <Button style={{ margin:'10px 10px 10px 0px' }}>
                                <Icon type="upload" />上传并预览
                             </Button>
                        </Upload>
                    </Col>
                    <Col>
                        <span>
                            审核人：
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                    <Col>
                    <span>
                        项目-单位工程：
                        <Cascader
                            options={this.state.options}
                            className='btn'
                            loadData={this.loadData.bind(this)}
                            onChange={this.onSelectProject.bind(this)}
                            changeOnSelect
                            placeholder="请选择项目及子单位工程"
                        />
                    </span> 
                </Col>
                </Row>
                <Preview />
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
                </div>
            </Modal>
        )
    }
}
