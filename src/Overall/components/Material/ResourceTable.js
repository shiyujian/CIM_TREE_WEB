import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker} from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
export default class ResourceTable extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'' 
         }
    }
	// state = { 
	// 	visible: false,
	// 	data:[],
	// 	indexSelect:'' 
	// }
	  showModal = (key) => {
	    this.setState({
	      visible: true,
	      indexSelect:key
	    }); 
	    console.log('key',this.state.indexSelect)
	  }
	  handleOk = (e) => {
	    this.setState({
	      visible: false,
	    });
	  }
	  handleCancel = (e) => {
	    this.setState({
	      visible: false,
	    });
	  }
	render() {
		let {
			  visible,data
        } = this.state;
		const { Doc = [] } = this.props;
		return (
			<div>
				<Table rowSelection={this.rowSelection}
					dataSource={Doc}
					columns={this.columns}
					bordered rowKey="code" />
			{
				this.state.visible==true &&
				<Modal
		          title="查看文档"
		          width={920}
		          // footer={null}
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
	                            <Row gutter={15} style={{marginTop:'2em'}} >
	                                <Col span={8}>
	                                    <FormItem   {...ResourceTable.layoutT} label="单位工程:">
	                                     <Select  style={{width:'90%'}} value={Doc[this.state.indexSelect].extra_params.engineer}>
	                                          <Option value='第一阶段'>第一阶段</Option>
	                                          <Option value='第二阶段'>第二阶段</Option>
	                                          <Option value='第三阶段'>第三阶段</Option>
	                                          <Option value='第四阶段'>第四阶段</Option>
	                                     </Select>
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="名称:">
	                                        <Input value={Doc[this.state.indexSelect].extra_params.resource} />
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="编号:">
	                                        <Input value={Doc[this.state.indexSelect].extra_params.number} />
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                            <Row gutter={15}>
	                                <Col span={8}>
	                                    <FormItem  {...ResourceTable.layoutT} label="审批单位:">
	                                        <Select style={{width:'100%'}} value={Doc[this.state.indexSelect].extra_params.approve} >
	                                              <Option value='第一公司'>第一公司</Option>
	                                              <Option value='第二公司'>第二公司</Option>
	                                        </Select>
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="进场日期:">
	                                        <DatePicker  value={moment(Doc[this.state.indexSelect].extra_params.time)}/>
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="施工部位:">
	                                        <Input value={Doc[this.state.indexSelect].extra_params.body}/>
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                        </Col>
	                    </Row>
	                    <Row gutter={24}>
	                        <Col span={24}>
	                        	<Table 
								   columns={this.equipmentColumns}
								   dataSource={Doc[this.state.indexSelect].extra_params.children}
								   bordered 
								   pagination={false}
								/>
	                        </Col>
	                    </Row>
	                    <Row gutter={24}>
	                        <Col span={24} style={{paddingLeft:'2em'}}>
	                            <Row gutter={15} style={{marginTop:'1em'}} >
	                                <Col span={3}>
	                                	<Button style={{width:100}}>附件</Button>
	                                </Col>
	                            </Row>
	                            <Row gutter={20} style={{marginTop:'1em'}} >
	                                <Col span={3} style={{marginLeft:'1em'}} span={4}>
	                                	<Icon type="paper-clip"></Icon>
	                                	<a>{Doc[this.state.indexSelect].name}</a>
	                                </Col>
	                                <Col span={4}>
	                                	<a onClick={this.previewFile.bind(this)}>预览</a>
										<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this)}>下载</a>
	                                </Col>
	                            </Row>
	                        </Col>
	                    </Row>
					</div>
		        </Modal>
			}	
			</div>
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
			title: '名称',
			dataIndex: 'extra_params.resource',
			key: 'extra_params.resource',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		},{
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
			title: '施工部位',
			dataIndex: 'extra_params.body',
			key: 'extra_params.body',
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
			dataIndex: 'resourceStyle',
			key: 'resourceStyle'
		}, {
			title: '操作',
			render: (text,record, index) => {
				const { Doc = [] } = this.props;
				let nodes = [];
				nodes.push(
					<div>
						<a type="primary" onClick={this.showModal.bind(this,index)}>查看</a>
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
            title: '名称',
            dataIndex: 'extra_params.equipName',
            key: 'extra_params.equipName',

        }, {
            title: '规格',
            dataIndex: 'extra_params.equipFormat',
            key: 'extra_params.equipFormat',
        },{
            title: '数量',
            dataIndex: 'extra_params.equipCount',
            key: 'extra_params.equipCount',
        }, {
            title: '单位',
            dataIndex: 'extra_params.equipUnit',
            key: 'extra_params.equipUnit',
        },{
            title: '产地',
            dataIndex: 'extra_params.equipPlace',
            key: 'extra_params.equipPlace', 
        }
    ];

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

	文件预览
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
}