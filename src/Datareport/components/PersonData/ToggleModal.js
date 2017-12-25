import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
const Search = Input.Search;
export default class ToggleModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            org: []
        }
    }
    render(){
        const {visible} = this.props;
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
                <div>
                    <Button style={{ margin: '10px 10px 10px 0px' }} type="primary">模板下载</Button>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={this.columns}
                        dataSource = {this.state.dataSource}
                        bordered />
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
                    <Button className="btn" type="primary" onClick={this.onok.bind(this)}>提交</Button>
                </div>
                <div style={{ marginTop: 20 }}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
            </Modal>
        )
    }
    submit(){

    }
    selectChecker(){

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
            record.signature = loadedFile;
            this.forceUpdate();
        });
        return false;
    }
    onok() {
        console.log("datasource",this.state.dataSource);
        const { actions: { ModalVisible } } = this.props;
        let ok = this.state.dataSource.some(ele => {
            return !ele.signature;
        });
        if(ok){
            message.error('有附件未上传');
            return;
        };
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
        ModalVisible(false);
    }
    cancel() {
        const { actions: { ModalVisible } } = this.props;
        ModalVisible(false);
    }
    onChange() {

    }
    //删除
    delete(){
        
    }
     //处理上传excel的数据
     handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map(item => {
            return {
                index: item[0],
                code: item[1],
                name: item[2],
                depart: item[3],
                job: item[4],
                sex: item[5],
                tel: item[6],
                email: item[7],
            }
        })
        return res;
    }
    componentDidMount(){
        const {actions:{getAllUsers,getOrgList}} = this.props;
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
        getOrgList().then(rst => {
            if (rst.children.length) {
                let org = rst.children.map(item => {
                    return (
                         <Option value={JSON.stringify(item)}>{item.name}</Option>
                    )
                })
                this.setState({org})
            }
        })
    }
    columns = [ {
        title: '人员编码',
        dataIndex: 'code',
        key: 'Code',
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'Name',
      },{
        title: '所在组织机构单位',
        render:(record) => {
            return (
                <Select style={{width:"90%"}} value = {record.org || this.state.defaultPro} onSelect={ele => {
                    record.org = ele;
                    this.forceUpdate();
                }}>
                    {this.state.org}
                </Select>
            )
        }
      },{
         title: '所属部门',
         dataIndex :'depart',
         key: 'Depart',
      },{
        title: '职务',
        dataIndex :'job',
        key: 'Job',
      },{
        title: '性别',
        dataIndex :'sex',
        key:'Sex'
      },{
        title: '手机号码',
        dataIndex :'tel',
        key:'Tel'
      },{
        title: '邮箱',
        dataIndex :'email',
        key:'Email'
      },{
        title:'二维码',
        key:'signature',
        render:(record) => (
            <Upload
                beforeUpload={this.beforeUploadPic.bind(this, record)}
            >
                <a>{record.signature ? record.signature.name : '点击上传'}</a>
            </Upload>
        )
      },{
        title:'编辑',
        dataIndex:'edit',
        render:(record) => (
            <Popconfirm
                placement="leftTop"
                title="确定删除吗？"
                onConfirm={this.delete.bind(this)}
                okText="确认"
                cancelText="取消"
            >
                <a>删除</a>
            </Popconfirm>
        )
    }]
}