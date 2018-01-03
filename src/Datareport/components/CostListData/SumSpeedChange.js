import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import ECCB from '../EditCellWithCallBack';
const moment = require('moment');
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumSpeedChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
            dataSource:[],
            opinion:''//变更意见
        };
    }
    componentWillMount(){
        let dataSource = this.props.dataSourceSelected;
        let newdataSource = [];
        dataSource.map((rst,key)=>{
            let newDatas = {
                key:key+1,
                code: rst.code,
                project: rst.project,
                nodetarget: rst.nodetarget,
                completiontime: rst.completiontime,
                remarks: rst.remarks,
                ratio: rst.ratio,
                unit: rst.unit,
                summoney: rst.summoney,
                deletecode: rst.code
            }
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})        
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
    

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }


    onok(){
        if(!this.state.check){
            notification.warning({
				message:'请选择审核人'
			})
            return;
        }
        if (this.state.dataSource.length === 0) {
            notification.warning({
				message:'请上传Excel表'
			})
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
        let {opinion} = this.state;
		this.props.onok(this.state.dataSource,per,opinion);
    }
    // 正则时间匹配
    dataChange(e){
        let data = moment(e.target.value).format('YYYY-MM-DD');
        if(data.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
        }else{
            notification.warning({
				message:'请检查输入日期格式是否为YYYY-MM-DD'
			})
        }
    }
    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        let newdataSource = [];
        dataSource.map((rst,key)=>{
            let newDatas = {
                key:key+1,
                code: rst.code,
                project: rst.project,
                nodetarget: rst.nodetarget,
                completiontime: rst.completiontime,
                remarks: rst.remarks,
                ratio: rst.ratio,
                unit: rst.unit,
                summoney: rst.summoney,
                deletecode: rst.code
            }
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})   
    }
    //输入
    tableDataChange(index, key ,e ){
        const { dataSource } = this.state;
        // console.log(dataSource)
		dataSource[index][key] = e.target['value'];
          this.setState({dataSource});
        //   console.log('dataSource:',dataSource)
    }
    //审核意见
    description(e) {
        this.setState({opinion:e.target.value});
	}
    render() {
        const columns =[
            {
              title: "序号",
              dataIndex: "key",
              width:"5%",
            },{
                title: "项目/子项目",
                dataIndex: "project",
              },
              {
                title: "单位工程",
                dataIndex: "unit",
              },
            {
              title: "工作节点目标",
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.nodetarget = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.nodetarget}
            //             checkVal={checkVal}
            //             value={record.nodetarget} />
            //     )
            // },
            // key:'Nodetarget',
            render:(text,record,index)=>(
                <Input value={this.state.dataSource[record.key-1]['nodetarget']} onChange={this.tableDataChange.bind(this,record.key-1,'nodetarget')}/>
            )
            },

            // {
            //   title: "完成时间",
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.completiontime = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.completiontime}
            //             checkVal={checkVal}
            //             value={record.completiontime} />
            //     )
            // },
            // key:'Completiontime',
            // },
            // {
            //   title: "支付金额（万元）",
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.summoney = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.summoney}
            //             checkVal={checkVal}
            //             value={record.summoney} />
            //     )
            // },
            // key:'Summoney',
            // },
            // {
            //   title: "累计占比",
            //   render: (record) => {
            //     let checkVal = (value) => {
            //         record.ratio = value;
            //         return value;
            //     }
            //     return (
            //         <ECCB
            //             initCheckedValue={record.ratio}
            //             checkVal={checkVal}
            //             value={record.ratio} />
            //     )
            // },
            // key:'Ratio',
            // },
            // {
            //   title: "备注",
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
            // },
            // key:'Remarks',
            // },

            // 使用input框进行编辑页面,不使用笔;
            {
                title: "完成时间",
                dataIndex: "completiontime",
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['completiontime']} onChange={this.tableDataChange.bind(this,record.key-1,'completiontime')}  onBlur={this.dataChange.bind(this)} />
                )
              },
              {
                title: "支付金额（万元）",
                dataIndex: "summoney",
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['summoney']} onChange={this.tableDataChange.bind(this,record.key-1,'summoney')}/>
                )
              },
              {
                title: "累计占比",
                dataIndex: "ratio",
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['ratio']} onChange={this.tableDataChange.bind(this,record.key-1,'ratio')}/>
                )
              },
              {
                title: "备注",
                dataIndex: "remarks",
                render:(text,record,index)=>(
                    <Input value={this.state.dataSource[record.key-1]['remarks']} onChange={this.tableDataChange.bind(this,record.key-1,'remarks')}/>
                )
              },
            {
                title: "编辑",
                dataIndex: "edit",
                width:"5%",
                render: (text, record, index) => {
                  return (
                    <Popconfirm
                      placement="leftTop"
                      title="确定删除吗？"
                      onConfirm={this.delete.bind(this, record.key-1)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a><Icon type="delete" /></a>
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
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} onChange={this.description.bind(this)} placeholder='请输入变更原因' />
				    </Col>
			    </Row>
            </Modal>
        )
    }
}
