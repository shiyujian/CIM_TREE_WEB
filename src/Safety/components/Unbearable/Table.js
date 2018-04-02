import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon} from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';

const FormItem = Form.Item;

let indexSelect='';
export default class GeneralTable extends Component {

	// constructor(props){
 //         super(props);
 //         this.state={
 //         	visible: false,
	// 		indexSelect:'',
 //         }
 //    }
	//   showModal = (key) => {
	//     this.setState({
	//       visible: true,
	//       indexSelect:key
	//     }); 
	//     // console.log('key',this.state.indexSelect)
	//   }
	//   handleOk = (e) => {
	//     this.setState({
	//       visible: false,
	//     });
	//   }
	//   handleCancel = (e) => {
	//     this.setState({
	//       visible: false,　　
	//     });
	//   } 
	render() {
		// let {
		// 	  visible
  //       } = this.state;
		const { Doc = [],docs = [],} = this.props;
		return (
			<div>
				<Table
					rowSelection={this.rowSelection}
					dataSource={Doc}
					columns={this.columns}
					className='foresttables'
					bordered rowKey="code" />
			{
				// this.state.visible==true &&
				// <Modal
		  //         title="查看文档"
		  //         width={920}
		  //         // footer={null}
		  //         visible={this.state.visible}
		  //         maskClosable={false}
		  //         onOk={this.handleOk}
		  //         onCancel={this.handleCancel}
		  //       >
			 //        <div>
			 //        	<Row gutter={24}>
			 //        		<Col>
			 //        			<div style={{borderBottom: 'solid 1px #999'}}></div>
			 //        		</Col>
			 //        	</Row>
	   //                  <Row gutter={24}>
	   //                      <Col span={24} style={{paddingLeft:'3em'}}>
	   //                          <Row gutter={15} style={{marginTop:'2em'}} >
	   //                              <Col span={10}>
	   //                                  <FormItem   {...GeneralTable.layoutT} label="单位工程:">
	   //                                   <Select  style={{width:'90%'}} value={Doc[this.state.indexSelect].extra_params.engineer}>
	   //                                        <Option value='第一阶段'>第一阶段</Option>
	   //                                        <Option value='第二阶段'>第二阶段</Option>
	   //                                        <Option value='第三阶段'>第三阶段</Option>
	   //                                        <Option value='第四阶段'>第四阶段</Option>
	   //                                   </Select>
	   //                                  </FormItem>
	   //                              </Col>
	   //                              <Col span={10}>
	   //                                  <FormItem {...GeneralTable.layoutT} label="主题:">
	   //                                      <Input value={Doc[this.state.indexSelect].extra_params.number} />
	   //                                  </FormItem>
	   //                              </Col>
	   //                          </Row>
	   //                          <Row gutter={15}>
	   //                              <Col span={10}>
	   //                                  <FormItem  {...GeneralTable.layoutT} label="文档类型:">
	   //                                      <Select style={{width:'90%'}} value={Doc[this.state.indexSelect].extra_params.approve} >
	   //                                            <Option value='水环境'>水环境</Option>
	   //                                            <Option value='空气环境'>空气环境</Option>
	   //                                      </Select>
	   //                                  </FormItem>
	   //                              </Col>
	   //                              <Col span={10}>
	   //                                  <FormItem {...GeneralTable.layoutT} label="编号:">
	   //                                      <Input value={Doc[this.state.indexSelect].extra_params.theme} />
	   //                                  </FormItem>
	   //                              </Col>
	   //                          </Row>
	   //                      </Col>
	   //                  </Row>
	   //                  <Row gutter={24}>
	   //                      <Col span={24} style={{paddingLeft:'2em'}}>
	   //                          <Row gutter={15} style={{marginTop:'1em'}} >
	   //                              <Col span={3}>
	   //                              	<Button style={{width:100}}>附件</Button>
	   //                              </Col>
	   //                          </Row>
	   //                          <Row gutter={20} style={{marginTop:'1em'}} >
	   //                          	<Col span={8} style={{marginLeft:'1em'}} >
	   //                          		<Table  dataSource={[Doc[this.state.indexSelect]]} 
				//                                 columns={this.optioncolumns} 
				//                                 showHeader={false}
				//                                 pagination={false}
    //                              		/>
	   //                          	</Col>
	   //                          </Row>
	   //                      </Col>
	   //                  </Row>
				// 	</div>
		  //       </Modal>
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

	// optioncolumns=[
	// 	{
	// 		title:'文档名称',
	// 		width:'40%',
	// 		render:()=>{
	// 			const { Doc = [] } = this.props;
	// 			return(
	// 				<div>
	// 					<Icon type="paper-clip"></Icon>
	// 	                <a>{Doc[this.state.indexSelect].name}</a>
	//                 </div>
	//             )
	// 		}
	// 	},{
	// 		title:'操作',
	// 		width:'60%',
	// 		render:()=>{
	// 			const { Doc = [] } = this.props;
	// 			return (
	// 				<div>
	// 					<a onClick={this.previewFile.bind(this,Doc[this.state.indexSelect])}>预览</a>
	// 					<a  style={{ marginLeft: 10 }}  
	// 					  	href={Doc[this.state.indexSelect].basic_params.files[0].a_file}>下载
	// 					</a>
	// 				</div>
	// 			)
	// 		}
	// 	},
	// ]
	columns = [
		{
			title: '工程名称',
			dataIndex: 'extra_params.engineer',
			key: 'extra_params.engineer',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '主题',
			dataIndex: 'extra_params.theme',
			key: 'extra_params.theme',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '文档类型',
			dataIndex: 'extra_params.style',
			key: 'extra_params.style',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
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
		}, 	{
			title: '操作',
			render: (text,record, index) => {
				const { Doc = [] } = this.props;

				let nodes = [];
				nodes.push(
				// return (
					<div>
						{/*<a type="primary" onClick={this.showModal.bind(this,index)}>查看</a>*/}
						{/*<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>查看流程卡</a>*/
						}
						<a onClick={this.previewFile.bind(this,Doc[index])}>预览</a>
						<a  style={{ marginLeft: 10 }}  
						  	href={Doc[index].basic_params.files[0].a_file}>下载
						</a>
					</div>
				// )
				);
				return nodes;
			}
		}
	];

	//文件预览
	previewFile(file) {
		const { actions: { openPreview } } = this.props;
		if (JSON.stringify(file.basic_params) == "{}") {
			return
		} else {
			const filed = file.basic_params.files[0];
			openPreview(filed);
		}
	}

	static layoutT = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
}