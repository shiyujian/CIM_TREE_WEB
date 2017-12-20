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
        this.props.setData(this.state.dataSource,JSON.parse(this.state.passer));
        ModalVisibleProject(false);
    }
    cancel() {
        const { actions: { ModalVisibleProject } } = this.props;
        ModalVisibleProject(false);
    }
    onChange() {

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
        });
    }
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
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
            record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
      }, {
        title: '项目/子项目名称',
        render:(record)=>{
            let color = 'red';
            if(record.file){
                color = 'green';
            }
            return(
                <span style = {{color:color}}>{record.name}</span>
            )
        },
        key: 'Name',
      }, {
        title: '所属项目',
        dataIndex: 'genus',
        key: 'Genus',
      },{
        title: '所属区域',
        dataIndex: 'area',
        key: 'Area',
      },{
         title: '项目类型',
         dataIndex :'type',
         key: 'Type',
      },{
        title: '项目地址',
        dataIndex :'address',
        key: 'Address',
      },{
        title: '项目红线坐标',
        dataIndex :'coordinate',
        key: 'Coordinate',
      },{
        title: '项目负责人',
        dataIndex :'duty',
        key:'Duty'
      },{
        title: '计划开工日期',
        dataIndex :'stime',
        key:'Stime'
      },{
        title: '计划竣工日期',
        dataIndex :'etime',
        key:'Etime'
      },{
          title:'附件',
          key:'nearby',
          render:(record) => (
            <Upload
            beforeUpload = {this.beforeUpload.bind(this,record)}
            >
                <a>上传附件</a>
            </Upload>
          )
      }]
    //处理上传excel的数据
    handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map((item,index) => {
            return {
                index: index + 1,
                name: item[1],
                genus: item[2],
                area: item[3],
                type: item[4],
                address: item[5],
                coordinate: item[6],
                duty: item[7],
                stime: item[8],
                etime: item[9]
            }
        })
        return res;
    }
}