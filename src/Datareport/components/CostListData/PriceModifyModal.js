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
            dataSource:this.props.modifyData,
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:[],
            concatunit:{},
            options:[],
            unit:{},
		};
    }
    componentDidMount(){

        const {actions:{getAllUsers,getWorkflowById,getProjectTree}} = this.props;
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
		this.props.onok(this.state.dataSource,per)
    }
    删除
    delete(index){
        let {dataSource} = this.state
        dataSource.splice(index,1)
        this.setState({dataSource})
    }

    //输入
    onCellChange = (index, key, record) => {      //编辑某个单元格
        const { dataSource } = this.state;
        return (value) => {
            dataSource[index][key] = value;
            record[key] = value;
        };
    }

	render() {
        const columns = 
            [{
                title: "序号",
                dataIndex: "code",
                width:"5%",
                render:(text,record,index) => {
					return record.key
				}
              },{
                title: "项目/子项目",
                dataIndex: "subproject"
              },
              {
                title: "单位工程",
                dataIndex: "unitengineering"
              },
              {
                title:'清单项目编码',
                dataIndex:'projectcoding',
                width:"10%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.projectcoding}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "projectcoding", record)}
                            pagination={{showQuickJumper:true,showSizeChanger:true,total:this.state.dataSource.length}} 
                        />
                    </div>
                )
              },
              {
                title:'计价单项',
                dataIndex:'valuation',
                width:"10%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.valuation}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "valuation", record)}
                        />
                    </div>
                )
              },
              {
                title:'工程内容/规格编号',
                dataIndex:'rate',
                width:"12%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.rate}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "rate", record)}
                        />
                    </div>
                )
              },
              {
                title:'计价单位',
                dataIndex:'company',
                width:"10%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.company}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "company", record)}
                        />
                    </div>
                )
              },
              {
                title:'结合单价（元）',
                dataIndex:'total',
                width:"10%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.total}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "total", record)}
                        />
                    </div>
                )
              },
              {
                title:'备注',
                dataIndex:'remarks',
                width:"10%",
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.remarks}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "remarks", record)}
                        />
                    </div>
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
