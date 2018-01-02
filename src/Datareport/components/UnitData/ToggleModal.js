import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
const Search = Input.Search;
const {Option} = Select
export default class ToggleModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: []
        }
    }
    render(){
        const {visible} = this.props;
        let jthis = this;
        const props = {
			action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
			headers: {
			},
			showUploadList: false,
		    async onChange(info) {
		        if (info.file.status !== 'uploading') {
		        }
		        if (info.file.status === 'done') {
		        	let importData = info.file.response.Sheet1;
                    let dataSource = jthis.handleExcelData(importData);
                    console.log(dataSource);
                    let orgset =  {};
                    dataSource.forEach(ele=>{
                        orgset[ele.org] = null;
                    });
                    let {getOrgByCode} = jthis.props.actions;
                    message.success(`${info.file.name} file uploaded successfully`);
                    let orgCodes = Object.keys(orgset);
                    let promises= orgCodes.map(code=>{
                        return getOrgByCode({code:code});
                    });
                    let rsts = await Promise.all(promises);
                    rsts.forEach(rst=>{
                        if(rst.code){
                            orgset[rst.code] = rst;
                        }
                    });
                    dataSource.forEach(data=>{
                        if(orgset[data.org]){
                            data.rsp_org = orgset[data.org];
                            return;
                        }
                        data.error =data.error|| [];
                        data.error.push(`组织机构：${data.org} 不存在`);
                    });
                    jthis.setState({dataSource});
		        } else if (info.file.status === 'error') {
		            message.error(`${info.file.name}解析失败，请检查输入`);
		        }
		    },
        };
        console.log(this.state.dataSource);
        return (
            <Modal
                visible={visible}
                width={1280}
                onOk={this.ok.bind(this)}
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
                            this.setState({passer:ele})
                        }} >
                        {
                            this.state.checkers || []
                        }
                    </Select>
                </span>
                <span>
                所属项目：
                    <Select style={{ width: '200px' }} className="btn" onSelect = {ele=>{
                        this.setState({project:ele})
                    }} >
                    {
                        this.state.projcheckers || []
                    }
                </Select>
            </span>
                <Button type="primary" >提交</Button>
               <div style={{marginTop:"30px"}}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{paddingLeft:"25px"}}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
               </div>
            </Modal>
        )
    }
    ok() {
        const { actions: { ModalVisibleProject } } = this.props;
        let ok = this.state.dataSource.some(ele => {
            return !ele.file;
        });
        if(ok){
            message.error('有附件未上传');
            return;
        };
        if(!this.state.passer){
            message.error('审批人未选择');
            return;
        }   
        if(!this.state.project){
            message.error('所属项目未选择');
            return;
        }
        let isError = false;
        this.state.dataSource.some(ele=>{
            return ele.error && ele.error.length>0
        });
        if(isError){
            message.error('表格信息有误');
        }
        this.props.setData(
            {
                dataSource: this.state.dataSource,
                project:this.state.projSet[this.state.project]
            }
            , JSON.parse(this.state.passer));
        ModalVisibleProject(false);
    }
    cancel() {
        const { actions: { ModalVisibleUnit } } = this.props;
        ModalVisibleUnit(false);
    }
    componentDidMount(){
        const {actions:{getAllUsers,getProjectAc}} = this.props
        getAllUsers().then(res => {
            console.log(res);
            let set = {};
            let checkers = res.map(o => {
                set[o.id] = o;
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers,usersSet:set});
        });
        getProjectAc().then(res=>{
            let set = {};
            let projcheckers = res.children.map(o => {
                set[o.code] = o;
                return (
                    <Option value={o.code}>{o.name}</Option>
                )
            });
            console.log(projcheckers);
            this.setState({projcheckers,projSet:set});
        });
    }
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPic(record,file){
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
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.pic = loadedFile;
            this.forceUpdate();
        });
        return false;
    }
    beforeUpload(record,file){
        console.log(record,file);
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
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.file = loadedFile;
            // record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
    isRecordError(record){
        if(record.error && record.error.length>0){
            return true;
        }
        if(!record.file){
            return true;
        }
        return false;
    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
      },{
        title: '单位工程编码',
        render:(record)=>{
            let color = 'red';
            if(!this.isRecordError(record)){
                color = 'green';
            }
            return(
                <span style = {{color:color}}>{record.code}</span>
            )
        },
        key: 'Code',
      }, {
        title: '单位工程名称',
        render:(record)=>{
            let color = 'red';
            if(!this.isRecordError(record)){
                color = 'green';
            }
            return(
                <span style = {{color:color}}>{record.name}</span>
            )
        },
        key: 'Name',
      }, 
      {
         title: '项目类型',
        render:(record)=>{
            return(
            <Select style={{ width: '70px' }} className="btn" value = {record.projType||''} onSelect={ele => {
                record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = '建筑'>建筑</Option>
                <Option value = '市政'>市政</Option>
                <Option value = '园林'>园林</Option>
            </Select>)
        },
         key: 'Type',
      },{
        title: '项目阶段',
        render:(record)=>{
            return(
            <Select style={{ width: '70px' }} className="btn" value = {record.stage||''} onSelect={ele => {
                record.stage = ele;
                this.forceUpdate();
            }} >
                <Option value = '初设阶段'>初设阶段</Option>
                <Option value = '施工阶段'>施工阶段</Option>
                <Option value = '竣工阶段'>竣工阶段</Option>
            </Select>)
        },
         key: 'Stage',
      },{
        title: '单位红线坐标',
        dataIndex :'coordinate',
        key:'coordinate'
      },{
        title: '计划开工日期',
        dataIndex :'stime',
        key:'Stime'
      },{
        title: '计划竣工日期',
        dataIndex :'etime',
        key:'Etime'
      },{
        title: '单位工程简介',
        dataIndex :'intro',
        key:'Intro'
      },{
        title: '建设单位',
        render:(record)=>{
            let rst = '';
            if(record.rsp_org){
                rst = record.rsp_org.name;
            }
            return(<span>{rst}</span>)
        },
        key:'Org'
      },{
          title:'附件',
          key:'nearby',
          render:(record) => (
            <Upload
            beforeUpload = {this.beforeUpload.bind(this,record)}
            >
                <a> {record.file?record.file.name:'上传附件'}</a>
            </Upload>
          )
      }]
    //处理上传excel的数据
    handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map((item,index) => {
            return {
                index: index + 1,
                code:item[0],
                name: item[1],
                stage: item[4-1],
                org: item[8-1],
                coordinate: item[5-1],
                stime: item[6-1],
                etime: item[7-1],
                intro:item[9-1],
                projType:item[3-1],
            }
        })
        return res;
    }
}