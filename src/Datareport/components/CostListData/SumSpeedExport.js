import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumSpeedExport extends Component {

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
    

    //下拉框选择人
    // selectChecker(value){
    //     let check = JSON.parse(value);
    //     this.setState({check})
    // }


    onok(){
        // if(!this.state.check){
        //     message.info("请选择审核人")
        //     return;
        // }
        // let {check} = this.state;
        // let per = {
        //     id:check.id,
        //     username:check.username,
        //     person_name:check.account.person_name,
        //     person_code:check.account.person_code,
        //     organization:check.account.organization
        // }
        // this.props.onok(this.state.dataSource,per);
        // console.log('export:',this.state.dataSource,per)
    }

   
    render() {
        const columns =[
            {
              title: "序号",
              dataIndex: "key",
              width:"5%",
              render: (text, record, index) => {
                return index + 1;
              }
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
              dataIndex: "nodetarget",
            },
            {
              title: "完成时间",
              dataIndex: "completiontime",
            },
            {
              title: "支付金额（万元）",
              dataIndex: "summoney",
            },
            {
              title: "累计占比",
              dataIndex: "ratio",
            },
            {
              title: "备注",
              dataIndex: "remarks",
              width:"5%"
            },
          ];
        return (
            <Modal
			title="结算进度导出表格表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
            <h1 style ={{textAlign:'center',marginBottom:20}}>结算进度导出表格表</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
                {/* <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col>
                        <span>
                            审核人：
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)} mode="combobox" placeholder="可搜索审查人">
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                </Row> */}
                <Preview />
            </Modal>
        )
    }
}
