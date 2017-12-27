import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification, DatePicker } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import EditableCell from '../EditableCell';
const {Option} = Select

export default class PriceModifyModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
            dataSource:[],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:[],
            concatunit:{},
            options:[],
            unit:{},
		};
    }
    componentDidMount(){

        const {actions:{getAllUsers,getWorkflowById,getProjectTree}, modifyData} = this.props;
        this.setState({
            dataSource: modifyData
        })
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        });
    }
	
    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }

    
	//ok
	onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
       
		let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
        debugger;
		this.props.onok(this.state.dataSource,per)
    }
    删除
    delete(index){
        let {dataSource} = this.state
        dataSource.splice(index,1)
        this.setState({dataSource})
    }

    //输入
    tableDataChange(index, key ,e ){
        const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
          this.setState({dataSource});
          console.log('dataSource:',dataSource)
    }

	render() {
        const columns = 
            [{
                title: "序号",
                dataIndex: "index",
                width:"5%",
                render: (text, record, index) => {
                  return index + 1;
                }
              },{
                title: "项目/子项目",
                dataIndex: "subproject"
              },
              {
                title: "单位工程",
                dataIndex: "unit"
              },
              {
                title:'编码',
                dataIndex:'code',
                width: '10%',
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['code']} onChange={this.tableDataChange.bind(this,index,'code')}/>
                )
              },
              {
                title:'清单项目编码',
                dataIndex:'projectcoding',
                width:"10%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['projectcoding']} onChange={this.tableDataChange.bind(this,index,'projectcoding')}/>
                )
              },
              {
                title:'计价单项',
                dataIndex:'valuation',
                width:"10%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['valuation']} onChange={this.tableDataChange.bind(this,index,'valuation')}/>
                )
              },
              {
                title:'工程内容/规格编号',
                dataIndex:'rate',
                width:"12%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['rate']} onChange={this.tableDataChange.bind(this,index,'rate')}/>
                )
              },
              {
                title:'计价单位',
                dataIndex:'company',
                width:"10%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['company']} onChange={this.tableDataChange.bind(this,index,'company')}/>
                )
              },
              {
                title:'结合单价（元）',
                dataIndex:'total',
                width:"10%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['total']} onChange={this.tableDataChange.bind(this,index,'total')}/>
                )
              },
              {
                title:'备注',
                dataIndex:'remarks',
                width:"10%",
                render: (text, record, index) => (
                    <Input value={this.state.dataSource[index]['remarks']} onChange={this.tableDataChange.bind(this,index,'code')}/>
                )
              }];
		return (
			<Modal
			title="计价清单信息变更表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
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