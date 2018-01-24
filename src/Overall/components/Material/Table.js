import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input} from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
import '../../../Datum/components/Datum/index.less'

export default class GeneralTable extends Component {

	state = { 
		visible: false,
		data:[] 
	}
	  showModal = () => {
	    this.setState({
	      visible: true,
	    }); 
	  }
	  handleOk = (e) => {
	    console.log(e);
	    this.setState({
	      visible: false,
	    });
	  }
	  handleCancel = (e) => {
	    console.log(e);
	    this.setState({
	      visible: false,
	    });
	  }
	render() {
		let {
			  visible,data
        } = this.state;
		const { Doc = [] } = this.props;
		// console.log('table.this.props',this.props)
		console.log('table.this.props', this.props)
		return (
			<Table
				rowSelection={this.rowSelection}
				dataSource={Doc}
				columns={this.columns}
				className='foresttables'
				bordered rowKey="code" />
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRows);
		},
	};

	columns = [
		{
			title: '单位工程',
			dataIndex: 'extra_params.engineer',
			key: 'extra_params.engineer',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '文档类型',
			dataIndex: 'extra_params.style',
			key: 'extra_params.style',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '提交单位',
			dataIndex: 'submitCompany',
			key: 'submitCompany',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '提交人',
			dataIndex: 'submitPerson',
			key: 'submitPerson'
		}, {
			title: '提交时间',
			dataIndex: 'submitTime',
			key: 'submitTime'
		}, {
			title: '流程状态',
			dataIndex: 'flowStyle',
			key: 'flowStyle'
		}, {
			title: '操作',
			render: (record, index) => {
				let nodes = [];
				nodes.push(
					<div>
						{
							// <a onClick={this.previewFile.bind(this, record)}>查看</a>
						}
						<a type="primary" onClick={this.showModal}>查看</a>
						<Modal
				          title="查看文档"
				          width={920}
				          visible={this.state.visible}
				          maskClosable={false}
				          onOk={this.handleOk}
				          onCancel={this.handleCancel}
				        >
					        <div>
					        	<Row gutter={24}>
					        		<Col>
					        			<div style={{borderBottom: 'solid 1px #999'}}></div>
					        		</Col>
					        	</Row>
			                    <Row gutter={24}>
			                        <Col span={24} style={{paddingLeft:'3em'}}>
			                            <Row gutter={15} >
			                                <Col span={10}>
			                                    <FormItem   {...GeneralTable.layoutT} label="单位工程:">
			                                     <Select>
			                                          <Option value='第一阶段'>第一阶段</Option>
			                                          <Option value='第二阶段'>第二阶段</Option>
			                                          <Option value='第三阶段'>第三阶段</Option>
			                                          <Option value='第四阶段'>第四阶段</Option>
			                                     </Select>
			                                    </FormItem>
			                                </Col>
			                                <Col span={10}>
			                                    <FormItem {...GeneralTable.layoutT} label="编号:">
			                                        <Input  />
			                                    </FormItem>
			                                </Col>
			                            </Row>
			                            <Row gutter={15}>
			                                <Col span={20}>
			                                    <FormItem  {...GeneralTable.layout} label="审批单位:">
			                                        <Select>
			                                              <Option value='第一公司'>第一公司</Option>
			                                              <Option value='第二公司'>第二公司</Option>
			                                        </Select>
			                                    </FormItem>
			                                </Col>
			                            </Row>
			                        </Col>
			                    </Row>
			                    <Row gutter={24}>
			                        <Col span={24}>
			                        	<Table rowSelection={this.rowSelection}
										   columns={this.equipmentColumns}
										   dataSource={this.state.data}
										   bordered 
										/>
			                        </Col>
			                    </Row>
							</div>
				        </Modal>
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>查看流程卡</a>
					</div>
				);
				return nodes;
			}
		}
	];

	equipmentColumns=[
        {
            title: '设备名称',
            dataIndex: 'extra_params.equipName',
            key: 'extra_params.equipName',

        }, {
            title: '规格型号',
            dataIndex: 'extra_params.equipNumber',
            key: 'extra_params.equipNumber',
        }, {
            title: '数量',
            dataIndex: 'extra_params.equipCount',
            key: 'extra_params.equipCount',
        }, {
            title: '进场日期',
            dataIndex: 'extra_params.equipTime',
            key: 'extra_params.equipTime',
        }, {
            title: '技术状况',
            dataIndex: 'extra_params.equipMoment',
            key: 'extra_params.equipMoment',
        },{
            title: '备注',
            dataIndex: 'extra_params.equipRemark',
            key: 'extra_params.equipRemark',
        }
    ];

    rowSelection = {
        onChange: (selectedRowKeys) => {
            const {actions: {selectDocuments}} = this.props;
            selectDocuments(selectedRowKeys);
        },
    };
	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	download(index, key, e) {
		const { selected = [], file = [], files = [], down_file = [] } = this.props;

		if (selected.length == 0) {
			message.warning('没有选择无法下载');
		}
		for (var j = 0; j < selected.length; j++) {
			if (selected[j].code == index.code) {

				selected.map(rst => {
					file.push(rst.basic_params.files);
				});
				file.map(value => {
					value.map(cot => {
						files.push(cot.download_url)
					})
				});
				files.map(down => {
					let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
					this.createLink(this, down_load);
				});
			}
		}
	}

	//文件预览
	// previewFile(file) {
	// 	const { actions: { openPreview } } = this.props;
	// 	if (JSON.stringify(file.basic_params) == "{}") {
	// 		return
	// 	} else { 
	// 		const filed = file.basic_params.files[0];
	// 		openPreview(filed);
	// 	}
	// }
	previewFile(file) {
		const { actions: { openPreview } } = this.props;
		if (JSON.stringify(file.basic_params) == "{}") {
			return
		} else {
			const filed = file.basic_params.files[0];
			openPreview(filed);
		}
	}

	update(file) {
		const { actions: { updatevisible, setoldfile } } = this.props;
		updatevisible(true);
		setoldfile(file);
	}
	static layoutT = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    static layout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
}