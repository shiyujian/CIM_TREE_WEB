import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import ECCB from '../EditCellWithCallBack';
const FormItem = Form.Item;
const Option = Select.Option;

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
        if(!this.state.check){
            message.info("请选择审核人")
            return;
        }
        let {check} = this.state;
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
        this.props.onok(this.state.dataSource,per);
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
        // console.log(dataSource)
		dataSource[index][key] = e.target['value'];
        this.setState({dataSource});
        // console.log('dataSource:',dataSource)
    }

    render() {
        const columns =[
            {
              title: "序号",
              dataIndex: "key",
              width:"5%",
            },{
                title: "项目/子项目",
                dataIndex: "subproject",
            },{
                title: "单位工程",
                dataIndex: "unit",
               
              },{
              title: "清单项目编号",
              dataIndex: 'projectcoding',
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.projectcoding = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.projectcoding}
            //             checkVal={checkVal}
            //             value={record.projectcoding} />
            //     )
            //   },
              key:'Projectcoding'
            }, {     
              title: "项目名称",
              dataIndex: 'projectname',
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['projectname']} onChange={this.tableDataChange.bind(this,record.key-1,'projectname')}/>
              )
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.projectname = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.projectname}
            //             checkVal={checkVal}
            //             value={record.projectname} />
            //     )
            //   },
            //   key:"Projectname"
            },{
              title: "计量单位", 
              dataIndex: 'company',  
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['company']} onChange={this.tableDataChange.bind(this,record.key-1,'company')}/>
              )  
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.company= value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.company}
            //             checkVal={checkVal}
            //             value={record.company} />
            //     )
            //   },
            //   key:"Company"
            }, {        
              title: "数量",
              dataIndex: 'number', 
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['number']} onChange={this.tableDataChange.bind(this,record.key-1,'number')}/>
              ) 
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.number = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.number}
            //             checkVal={checkVal}
            //             value={record.number} />
            //     )
            //   },
            //   key:"Number"
            },{
                title: "综合单价(元)",
                dataIndex: 'total',
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['total']} onChange={this.tableDataChange.bind(this,record.key-1,'total')}/>
                )                 
                // render: (record) => {
                //     let checkVal = (value) => {
                //         record.total = value;
                //         return value;
                //     }
                //     return (
                //         <ECCB
                //             initCheckedValue={record.total}
                //             checkVal={checkVal}
                //             value={record.total} />
                //     )
                //   },
                //   key:"Total"
              },{
              title: "备注",
              dataIndex: 'remarks',
              render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['remarks']} onChange={this.tableDataChange.bind(this,record.key-1,'remarks')}/>
              )  
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.remarks = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.remarks}
            //             checkVal={checkVal}
            //             value={record.remarks} />
            //     )
            //   },
            //   key:"Remarks"
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
                      <a>删除</a>
                    </Popconfirm>
                  );
                }
              }
          ];
        return (
            <Modal
			title="工程量结算变更流程表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
            <h1 style ={{textAlign:'center',marginBottom:20}}>工程量结算变更流程</h1>
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
                <Preview />
            </Modal>
        )
    }
}
