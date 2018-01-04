import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import ECCB from '../EditCellWithCallBack';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
export default class ProjectSumChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSourceSelected,
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
            changeInfo:'',
        };
    }

    componentDidMount(){
        const {actions:{getAllUsers,getProjectTree}} = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
    }
    
    componentWillMount(){
        let dataSource = this.props.dataSourceSelected;
        let newdataSource = [];
        dataSource.map((item,key)=>{
            // console.log('item',item)
            let newDatas = {
                key:key+1,
                code: item.code,
                subproject: item.subproject,//项目/子项目
                unit: item.unit,//单位工程
                projectcoding: item.projectcoding,//项目编号
                projectname: item.projectname,//项目名称
                company: item.company,//计量单位
                number: item.number,//数量
                total: item.total,//单价
                remarks: item.remarks,//备注
            }
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})        
    }


    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }


    onok(){
        // let {dataSource} = this.state;
        // console.log('this.state.dataSource',this.state.dataSource)
        if(!this.state.check){
            notification.warning({message: "请选择审核人", duration: 2})
            return;
        }
        if (!this.state.changeInfo.length) {
            notification.warning({message:`请填写变更原因`,duration: 2});
            return;
        }
        // dataSource[0].changeInfo = this.state.changeInfo.trim();
        let {check} = this.state;
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
        let {changeInfo} = this.state;
        this.props.onok(this.state.dataSource,per,changeInfo);
        notification.success({
            message: '信息上传成功！',
            duration: 2
        });
    }

    
    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
                key:key+1,
                code: item.code,
                subproject: item.subproject,//项目/子项目
                unit: item.unit,//单位工程
                projectcoding: item.projectcoding,//项目编号
                projectname: item.projectname,//项目名称
                company: item.company,//计量单位
                number: item.number,//数量
                total: item.total,//单价
                remarks: item.remarks,//备注
            }
            newdataSource.push(newDatas)
        })
        // console.log('newdataSource',newdataSource)
      this.setState({dataSource:newdataSource})   
    }
    //输入
    tableDataChange(index, key ,e ){
        const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
        this.setState({dataSource});
      
    }
    //变更原因
    onChangeText(e) {
 
        this.setState({
            changeInfo: e.target.value
        });
    }
    render() {
        const columns =[
            {
              title: "序号",
              dataIndex: "key",
            },{
                title: "项目/子项目",
                dataIndex: "subproject",
            },{
                title: "单位工程",
                dataIndex: "unit",
               
              },{
              title: "清单项目编号",
              dataIndex: 'projectcoding',

              key:'Projectcoding'
            }, {     
              title: "项目名称",
              dataIndex: 'projectname',
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['projectname']} onChange={this.tableDataChange.bind(this,record.key-1,'projectname')}/>
              )
            },{
              title: "计量单位", 
              dataIndex: 'company',  
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['company']} onChange={this.tableDataChange.bind(this,record.key-1,'company')}/>
              )  
         
            }, {        
              title: "数量",
              dataIndex: 'number', 
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['number']} onChange={this.tableDataChange.bind(this,record.key-1,'number')}/>
              ) 
        
            },{
                title: "综合单价(元)",
                dataIndex: 'total',
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['total']} onChange={this.tableDataChange.bind(this,record.key-1,'total')}/>
                )                 
             
              },{
              title: "备注",
              dataIndex: 'remarks',
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['remarks']} onChange={this.tableDataChange.bind(this,record.key-1,'remarks')}/>
              )  

            },{
                title: "操作",
                render: (text, record, index) => {
                  return (
                    <Popconfirm
                      placement="leftTop"
                      title="确定删除吗？"
                      onConfirm={this.delete.bind(this, record.key-1)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a><Icon type = "delete"/></a>
                    </Popconfirm>
                  );
                }
              }
          ];
        return (
            <Modal
			
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
            <h1 style ={{textAlign:'center',marginBottom:20}}>申请变更</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col>
                        <span>
                            审核人：
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)} >
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                </Row>
                <Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>变更原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
                    <Input
                        type="textarea"
                        onChange={this.onChangeText.bind(this)}
                        autosize={{ minRows: 5, maxRow: 6 }}
                        placeholder="请填写变更原因"
                        style={{ marginBottom: 40 }}
                    />
				    </Col>
			    </Row>
            </Modal>
        )
    }
}
