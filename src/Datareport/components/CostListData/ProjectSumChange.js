import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
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
        notification.error({
            message: '信息上传成功！',
            duration: 2
        });
    }

    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        this.setState({dataSource});
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
              dataIndex: "index",
              width:"5%",
              render: (text, record, index) => {
                return index + 1;
              }
            },{
                title: "项目/子项目",
                dataIndex: "subproject",
                // render: (text, record, index) => (
                //     <Input value={this.state.dataSource[index]['project']} onChange={this.tableDataChange.bind(this,index,'project')}/>
                // )
              },
              {
                title: "单位工程",
                dataIndex: "unit",
                // render: (text, record, index) => (
                //     <Input value={this.state.dataSource[index]['unit']} onChange={this.tableDataChange.bind(this,index,'unit')}/>
                // )
              },
            {
              title: "清单项目编号",
              dataIndex: "projectcoding",
              render: (text, record, index) => (
                  <Input value={this.state.dataSource[index]['projectcoding']} onChange={this.tableDataChange.bind(this,index,'projectcoding')}/>
              )
            },
            {
              title: "项目名称",
              dataIndex: "projectname",
              render: (text, record, index) => (
                  <Input value={this.state.dataSource[index]['projectname']} onChange={this.tableDataChange.bind(this,index,'projectname')}/>
              )
            },
            {
              title: "计量单位",
              dataIndex: "company",
              render: (text, record, index) => (
                  <Input value={this.state.dataSource[index]['company']} onChange={this.tableDataChange.bind(this,index,'company')}/>
              )
            },
            {
              title: "数量",
              dataIndex: "number",
              render: (text, record, index) => (
                  <Input value={this.state.dataSource[index]['number']} onChange={this.tableDataChange.bind(this,index,'number')}/>
              )
            },{
                title: "单价",
                dataIndex: "total",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['total']} onChange={this.tableDataChange.bind(this,index,'total')}/>
                )
              },{
              title: "备注",
              dataIndex: "remarks",
              render: (text, record, index) => (
                  <Input value={this.state.dataSource[index]['remarks']} onChange={this.tableDataChange.bind(this,index,'remarks')}/>
              )
            },
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
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)} mode="combobox" placeholder="可搜索审查人">
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
