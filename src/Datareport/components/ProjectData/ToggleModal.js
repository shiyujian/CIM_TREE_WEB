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
                    message.success(`${info.file.name} file uploaded successfully`);
                    let perSet = {};
                    let {getPersonByCode} = jthis.props.actions;
                    for(let i=0;i< dataSource.length;i++){
                        perSet[dataSource[i].projBoss] = await getPersonByCode({code:dataSource[i].projBoss});
                    }
                    jthis.setState({perSet,dataSource});
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
            console.log(res);
            let set = {};
            let checkers = res.map(o => {
                set[o.id] = o;
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers,usersSet:set})
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
    columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
      },{
        title: '项目编码',
        render:(record)=>{
            let color = 'red';
            if(record.file && record.pic){
                color = 'green';
            }
            return(
                <span style = {{color:color}}>{record.code}</span>
            )
        },
        key: 'Code',
      }, {
        title: '项目/子项目名称',
        render:(record)=>{
            let color = 'red';
            if(record.file && record.pic){
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
        render:(record)=>{
            return(
            <Select style={{ width: '70px' }} className="btn" value = {record.projType||''} onSelect={ele => {
                record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = 'construct'>建筑</Option>
                <Option value = 'city'>市政</Option>
                <Option value = 'garden'>园林</Option>
            </Select>)
        },
         key: 'Type',
      },{
        title: '项目地址',
        dataIndex :'address',
        key: 'Address',
      },{
        title: '项目规模',
        dataIndex: 'range',
        key: 'Range',
      },{
        title: '项目红线坐标',
        dataIndex :'coordinate',
        key: 'Coordinate',
      },{
        title: '项目总投资（万元）',
        dataIndex :'cost',
        key: 'Cost',
      },{
        title: '项目负责人',
        render:(record)=>{
            return(
                <span>{this.state.perSet?this.state.perSet[record.projBoss].name:''}</span>
            )
        },
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
        title: '项目简介',
        dataIndex :'intro',
        key:'Intro'
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
      },{
        title:'图片',
        key:'pic',
        render:(record) => (
          <Upload
            beforeUpload = {this.beforeUploadPic.bind(this,record)}
          >
              <a>{record.pic? record.pic.name:'点击上传'}</a>
          </Upload>
        )
    }]
    //处理上传excel的数据
    handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map((item,index) => {
            return {
                index: index + 1,
                name: item[2],
                code:item[1],
                genus: item[3],
                area: item[4],
                address: item[6],
                coordinate: item[8],
                stime: item[11],
                etime: item[12],
                range:item[7],
                cost:item[9],
                intro:item[13],
                projType:item[5],
                projBoss:item[10]
            }
        })
        return res;
    }
}