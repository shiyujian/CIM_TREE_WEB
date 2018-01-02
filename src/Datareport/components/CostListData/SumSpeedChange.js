import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import ECCB from '../EditCellWithCallBack';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumSpeedChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSourceSelected,
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
            dataSource:[]
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
            message.info("请选择审核人")
            return;
        }
        if (this.state.dataSource.length === 0) {
            message.info("请上传excel");
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
        console.log(dataSource)
		dataSource[index][key] = e.target['value'];
          this.setState({dataSource});
          console.log('dataSource:',dataSource)
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
            {
              title: "完成时间",
              render: (record) => {
                let checkVal = (value) => {
                    record.completiontime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.completiontime}
                        checkVal={checkVal}
                        value={record.completiontime} />
                )
            },
            key:'Completiontime',
            },
            {
              title: "支付金额（万元）",
              render: (record) => {
                let checkVal = (value) => {
                    record.summoney = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.summoney}
                        checkVal={checkVal}
                        value={record.summoney} />
                )
            },
            key:'Summoney',
            },
            {
              title: "累计占比",
              render: (record) => {
                let checkVal = (value) => {
                    record.ratio = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.ratio}
                        checkVal={checkVal}
                        value={record.ratio} />
                )
            },
            key:'Ratio',
            },
            {
              title: "备注",
              render: (record) => {
                let checkVal = (value) => {
                    record.remarks = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.remarks}
                        checkVal={checkVal}
                        value={record.remarks} />
                )
            },
            key:'Remarks',
            },{
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
                      <a>删除</a>
                    </Popconfirm>
                  );
                }
              }
            
          ];
        return (
            <Modal
			title="结算进度变更流程表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
            <h1 style ={{textAlign:'center',marginBottom:20}}>结算进度变更流程</h1>
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
                <Preview />
            </Modal>
        )
    }
}
