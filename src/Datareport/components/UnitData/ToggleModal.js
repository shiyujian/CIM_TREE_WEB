import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
const Search = Input.Search;
export default class ToggleModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: []
        }
    }
    render(){
        const {actions:{postWorkpackages,postWorkpackagesOK},visible,postWorkpackagesOKp} = this.props;
        postWorkpackagesOK()
        console.log(postWorkpackagesOKp)
        let jthis = this
		//上传
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
                        this.setState({passer:ele})
                    }} >
                    {
                        this.state.checkers
                    }
                </Select>
            </span> 
            <div style={{marginTop:"30px"}}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{paddingLeft:"25px"}}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
               </div>
            </Modal>
        )
    }
    onok(){
      const {actions:{ModalVisibleUnit}} = this.props;
      let ok = this.state.dataSource.some(ele => {
        return !ele.file;
    });
   
    if (!this.state.passer) {
        message.error('审批人未选择');
        return;
    }
    this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
      ModalVisibleUnit(false);
    }
    cancel(){
      const {actions:{ModalVisibleUnit}} = this.props;
      ModalVisibleUnit(false);
    }
    componentDidMount(){
        const {actions:{getAllUsers}} = this.props;
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
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
            // record.file = loadedFile;
            // record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
      }, {
        title: '单位工程名称',
        dataIndex: 'unitName',
      }, {
        title: '所属项目/子项目名称',
        dataIndex: 'subItem',
      },{
        title: '项目类型',
        dataIndex: 'projectType',
        render:(record)=>{
            return(
            <Select style={{ width: '70px' }} onSelect={ele => {
                // record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = 'construct'>建筑</Option>
                <Option value = 'city'>市政</Option>
            </Select>)
        },
      },{
         title: '项目阶段',
         dataIndex :'projectPhase',
         render:(record)=>{
            return(
            <Select style={{ width: '70px' }} onSelect={ele => {
                // record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = 'construct'>初涉阶段</Option>
                <Option value = 'city'>施工图阶段</Option>
                <Option value = 'city'>竣工阶段</Option>
            </Select>)
        },
      },{
        title: '项目红线坐标',
        dataIndex :'coordinate',
      },{
        title: '计划开工日期',
        dataIndex :'planStartDate',
      },{
        title: '计划竣工日期',
        dataIndex :'planCompletionDate',
      },{
        title: '建设单位',
        dataIndex :'constructionUnit',
      },{
        title: '单位工程简介',
        dataIndex :'brief',
      },{
        title:'附件',
        dataIndex :'nearby',        
        title:'附件上传',
        key:'pic',
        render:(record) => (
            <Upload
            beforeUploadPic = {this.beforeUploadPic.bind(this,record)}
            >
                <a> {record.file?record.file.name:'附件上传'}</a>
            </Upload>
          )
  
      }]
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
    //处理上传excel的数据
    handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map(item => {
            return {
                index: item[0],
                unitName: item[1],
                subItem: item[2],
                projectType: item[3],
                projectPhase: item[4],
                coordinate: item[5],
                planStartDate: item[6],
                planCompletionDate: item[7],
                constructionUnit: item[8],
                brief: item[9],
                nearby: item[10]
            }
        })
        return res;
    }
}