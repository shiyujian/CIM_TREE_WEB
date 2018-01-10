import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumSpeedDelete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
            opinion:''//变更意见
        };
    }
    componentWillMount(){
        let dataSource = this.props.dataSourceSelected;
        let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
                key:key+1,
				project: item.project,
				unit: item.unit,
				nodetarget: item.nodetarget,
				completiontime: item.completiontime,
				summoney: item.summoney,
				ratio: item.ratio,
				remarks: item.remarks,
				code:item.code
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

    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
                key:key+1,
				project: item.project,
				unit: item.unit,
				nodetarget: item.nodetarget,
				completiontime: item.completiontime,
				summoney: item.summoney,
				ratio: item.ratio,
				remarks: item.remarks,
				code:item.code
            }
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})
    }
    //审核意见
    description(e) {
        this.setState({opinion:e.target.value});
	}
    render() {
        const columns =[
            {
              title: "序号",
              dataIndex: "key"
            },{
                title: "项目/子项目",
                dataIndex: "project"
              },
              {
                title: "单位工程",
                dataIndex: "unit"
              },
            {
              title: "工作节点目标",
              dataIndex: "nodetarget"
            },
            {
              title: "完成时间",
              dataIndex: "completiontime"
            },
            {
              title: "支付金额（万元）",
              dataIndex: "summoney"
            },
            {
              title: "累计占比",
              dataIndex: "ratio"
            },
            {
              title: "备注",
              dataIndex: "remarks"
            },
            {
              title: "编辑",
              dataIndex: "edit",
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
            <h1 style ={{textAlign:'center',marginBottom:20}}>申请删除</h1>
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
				    	<TextArea rows={2} onChange={this.description.bind(this)} placeholder='请输入删除原因' />
				    </Col>
			    </Row>
            </Modal>
        )
    }
}
