import React, { Component } from 'react';
import { Button, Input, Table, Modal, Select, Form, Upload, Icon, Row, Col, Radio,bordered, message, Popconfirm, Cascader } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
export default class SumPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            dataSource:[],
            checkers:[],//审核人下来框选项
            check:null, //审核人
            projects:[]
        }
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
        });
        getProjectTree({depth:1}).then(rst =>{
            if(rst.status){
                let projects = rst.children.map(item=>{
                    return (
                        {
                            value:JSON.stringify(item),
                            label:item.name,
                            isLeaf:false
                        }
                    )
                })
                this.setState({options:projects});
            }else{
                //获取项目信息失败
            }
        });
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
            let newdataSources = this.state.dataSource;
            for(var i=0;i<newdataSources.length;i++){
                newdataSources[i].subproject = project,
                newdataSources[i].unit = unit
            }
            this.setState({project,unit,dataSource:newdataSources});
            return;
        }
        
        //must choose all,otherwise make it null
        this.setState({project:{},unit:{}});
    }
    render () {
		  const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
			  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			getCheckboxProps: record => ({
			  disabled: record.name === 'Disabled User', // Column configuration not to be checked
			}),
          };
        const data = []
          const columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
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
              title: '编辑',
              dataIndex: 'edit',
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
            <div>
               
                <Modal
                    visible={this.state.visible}
                    onOk={this.onok.bind(this)}
                    onCancel={()=>{this.props.oncancel()}}
                    width ={1280}
                    >
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果预览</h1>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} bordered/>
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
                    <span>
                        项目-单位工程：
                        <Cascader
                        options={this.state.options}
                        className='btn'
                        loadData={this.loadData.bind(this)}
                        onChange={this.onSelectProject.bind(this)}
                        changeOnSelect
                      />
                    </span>
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
                </Modal>
            </div>
        )
    } 
    submit(){
        this.setState({
            visible: true,
        });
    }
    showModal = () => {
        this.setState({
          visible: true,
          visibles: true,
        });
      }
    hideModal = () => {
    this.setState({
        visible: false,
        visibles: false,
    });
    }
    download () {

    }
    confirm () {

    }
    select (){

    }
    upload () {

    }
    examine () {
        this.setState({
            visibles: true,
        });
    }
    download () {
        
    }
    onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
    }
    //处理上传excel的数据
    handleExcelData(data){
        data.splice(0,1);
        let res = data.map(item => {
            return {
            subproject:item[0],
            nodetarget:item[1],
            completiontime:item[2],
            summoney:item[3],
            ratio:item[4],
            remarks:item[5],
            edit:item[6]
            }
        })
        return res
    }
}