import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification, DatePicker } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const {Option} = Select

export default class PriceRmModal extends Component {

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
            deleteInfoNew:''
		};
    }
    componentDidMount(){

        const {actions:{getAllUsers,getWorkflowById,getProjectTree}, rmData} = this.props;
        this.setState({
            dataSource: rmData
        })
        getAllUsers().then(res => {
            let checkers = res.map((o, key) => {
                return (
                    <Option value={JSON.stringify(o)} key={key}>{o.account.person_name}</Option>
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
        let {dataSource} = this.state;
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }

        if (!this.state.deleteInfoNew.length) {
            message.info(`请填写删除原因`);
            return;
        }

        dataSource[0].deleteInfoNew = this.state.deleteInfoNew.trim();

		let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.props.onok(dataSource,per)
    }
    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource = dataSource.filter(item => item.key != index);
        this.setState({dataSource})
    }

    onChangeText(e) {
        this.setState({
            deleteInfoNew: e.target.value
        });
    }

	render() {
        const columns = 
            [{
                title:'序号',
                dataIndex:'code',
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
              },{
                title:'清单项目编码',
                dataIndex:'projectcoding',
                width:"10%"
            },{
                title:'计价单项',
                dataIndex:'valuation',
                width:"10%",
            },{
                title:'工程内容/规格编号',
                dataIndex:'rate',
                width:"12%",
            },{
                title:'计价单位',
                dataIndex:'company',
                width:"10%",
            },{
                title:'结合单价（元）',
                dataIndex:'total',
                width:"10%",
            },{
                title:'备注',
                dataIndex:'remarks',
                width:"10%",
            },{
                title: "操作",
                render: (text, record, index) => {
                  return (
                    <Popconfirm
                      placement="leftTop"
                      title="确定删除吗？"
                      onConfirm={this.delete.bind(this, record.key)}
                      okText="确认"
                      cancelText="取消"
                    >
                       <a><Icon type = "delete"/></a>
                    </Popconfirm>
                  );
                }
              }];
		return (
			<Modal
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
                    pagination={{showQuickJumper:true,showSizeChanger:true,total:this.state.dataSource.length}} 
                />
                <Row >
                    {
                        !this.state.dataSource.length ? <p></p>
                            :
                            (
                                <Col span={3} push={12} style={{ position: 'relative', top: -40, fontSize: 12 }}>
                                    [共：{this.state.dataSource.length}行]
								</Col>
                            )
                    }
                </Row>
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
                <Row style={{ marginBottom: 16 }}>
                    <Input
                        type="textarea"
                        onChange={this.onChangeText.bind(this)}
                        autosize={{ minRows: 5, maxRow: 6 }}
                        placeholder="请填写删除原因"
                        style={{ marginBottom: 40 }}
                    />
                </Row>
                <Preview />
            </Modal>
        )
    }
}
