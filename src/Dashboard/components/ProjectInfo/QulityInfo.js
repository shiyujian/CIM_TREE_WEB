import React, {Component} from 'react';
import {Table, Radio, Button,Spin,Form,Row,Col,Input} from 'antd';
const FormItem = Form.Item;
class QulityInfo extends Component{
	constructor(props) {
		super(props);
		this.state = {
			unit: {},
			project: {},
		}
	}
	render(){
		const {name='',extra_params={}}=this.state.unit;
		const {project={}}=this.state;
		return(
			<div style={{padding: '0 10px'}}>
				<div>
					<Row>
						<Col span={10} offset={2}>
							<div>单位工程名称：{name}</div>
						</Col>
						<Col span={10} offset={2}>
							<div>所属项目：{project.name}</div>
						</Col>
						<Col span={22} offset={2}>
							<div>
								单位工程简介：
								<Input type="textarea" rows={2} readOnly
									   value={extra_params.desc || ''}/>
							</div>
						</Col>
					</Row>
					<Row>
						<Col span={10} offset={2}>
							<div>参建单位：</div>
						</Col>
						<Col span={10} offset={2}>
							<div>关联其他单位工程：</div>
						</Col>
						<Col span={10} offset={2}>
							<Table dataSource={extra_params.unit || []} size="small"
								   scroll={{y:100}}
								   pagination={false}
								   columns={QulityInfo.unitColumns}
								   rowKey="code"/>
						</Col>
						<Col span={10} offset={2}>
							<Table dataSource={extra_params.projectUnit || []}
								   scroll={{y:100}}
								   pagination={false}
								   size="small" columns={QulityInfo.projectUnitColumns}
								   rowKey="code"/>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
	componentDidMount() {
		if(this.props.unit){
			let {unit,project} = this.props;
			this.setState({
				unit:unit,
				project:project,
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		let {unit,project} = nextProps;
		if (unit !== this.props.unit) {
			this.setState({
				unit:unit,
				project:project,
			})
		}
	}

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
	static layoutT = {
		labelCol: {span: 8},
		wrapperCol: {span: 12},
	};
	static unitColumns = [{
		title: '组织结构类型',
		dataIndex: 'type',
		key: 'type',
	}, {
		title: '组织结构名称',
		dataIndex: 'name',
		key: 'name',
	}];
	static projectUnitColumns = [{
		title: '单位工程名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '单位工程编码',
		dataIndex: 'code',
		key: 'code',
	}];
}

export default QulityInfo;