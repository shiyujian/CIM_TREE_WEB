import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,DatePicker,Select
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const {RangePicker}=DatePicker;

export default class Filter extends Component {

	static propTypes = {};
	state={
        engineerNumber:'',
        engineerName:'',
        engineerApprove:'',
        engineerTheme:'',
    }

	render() {

		const { actions: { toggleAddition,getdocument }, Doc = [] } = this.props;
		// console.log('DDDDD',Doc)
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<Col span={24} style={{paddingLeft:'5em'}}>
						<Row gutter={15}  style={{marginTop: 5}}>
							<Col span={8}>
								<FormItem   {...Filter.layoutT} label="单位工程:">
                                     <Select onSelect={(value,option)=>{
                                                    this.state.engineerName = value;
                                             }}
                                     >
                                          <Option value='第一阶段'>第一阶段</Option>
                                          <Option value='第二阶段'>第二阶段</Option>
                                          <Option value='第三阶段'>第三阶段</Option>
                                          <Option value='第四阶段'>第四阶段</Option>
                                     </Select>
                                </FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="主题:">
									<Input  placeholder="请输入..."
										onChange={(event)=>{
                                            event=(event)?event:window.event;
                                            this.state.engineerTheme = event.target.value;

	                                    }}
                                    />
                                </FormItem>
							</Col>
							<Col span={8}>
								<Button type="primary" 
										style={{marginLeft:'100px'}}
										onClick={this.onSearch.bind(this)} 
								>查询</Button>
							</Col>
						</Row>
						<Row gutter={15}  style={{marginTop: 5}}>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="文档类型:">
									<Select onSelect={(value,option)=>{
                                                this.state.engineerApprove = value;
                                             }}
									>
                                          <Option value='水环境'>水环境</Option>
                                          <Option value='空气环境'>空气环境</Option>
                                     </Select>
                                </FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layoutT} label="编号:">
									<Input  placeholder="请输入..."
											onChange={(event)=>{
                                                event=(event)?event:window.event;
                                                this.state.engineerNumber = event.target.value;
                                            }}
									/>
                                </FormItem>
							</Col>
							<Col span={8}>
								<Button type="primary" ghost 
										style={{marginLeft:'100px'}}
										onClick={this.clear.bind(this)}
								>清空</Button>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.isTreeSelected ?
							<Button style={{ marginRight: 10 }} disabled>新增</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
						}
						{
							(Doc.length === 0) ?
								<Button style={{ marginRight: 10 }} disabled>删除</Button> :
								<Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
									<Button style={{ marginRight: 10 }} type="primary" onClick={this.delete.bind(this)}>删除</Button>
								</Popconfirm>
						}
					</Col>
				</Row>
			</Form>
		);
	}

	onSearch(){
		//下面这个判断有问题，逻辑是错的
		const { actions: { getdocument }, Doc = [] } = this.props;
		console.log('Doc',Doc)
		let datas=[];
		for(let i=0;i<Doc.length;i++){
			if( Doc[i].extra_params.engineer==this.state.engineerName ||
				Doc[i].extra_params.theme==this.state.engineerTheme ||
				Doc[i].extra_params.approve==this.state.engineerApprove ||
				Doc[i].extra_params.number==this.state.engineerNumber){
				datas.push(Doc[i]);
			} 

		}
		console.log('datas',datas)
	}
	clear(){

	}
	// query(value) {
	// 	const { actions: { getdocument }, currentcode } = this.props;
	// 	let search = {
	// 		doc_name: value
	// 	};
	// 	getdocument({ code: currentcode.code }, search);
	// }
	cancel() {

	}

	delete() {
		const { selected } = this.props;
	}
	confirm() {
		const {
			coded = [],
			selected = [],
			currentcode = {},
			actions: { deletedoc, getdocument }
		} = this.props;
		if (selected === undefined || selected.length === 0) {
			message.warning('请先选择要删除的文件！');
			return;
		}
		selected.map(rst => {
			coded.push(rst.code);
		});
		let promises = coded.map(function (code) {
			return deletedoc({ code: code });
		});
		message.warning('删除文件中...');
		Promise.all(promises).then(() => {
			message.success('删除文件成功！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		}).catch(() => {
			message.error('删除失败！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		});
	}
	static layoutT = {
          labelCol: {span: 8},
          wrapperCol: {span: 16},
     };
};
