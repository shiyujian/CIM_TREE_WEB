import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button } from 'antd';
import DesignModal from '../components/ScheduleData/DesignModal';
import './quality.less';
const Search = Input.Search;
@connect(
	state => {
		const { platform } = state;
		return { platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions, }, dispatch),
	}),
)
export default class DesignScheduleData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible: false
		};
		this.columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '专业',
			dataIndex: 'major',
		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
		}, {
			title: '设计单位',
			dataIndex: 'unit',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}];
	}
	//批量上传回调
	setData(data) {
		this.setState({ addvisible: false })
	}
	render() {
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="设计进度" {...this.props} />
				<Row>
					<Button className="btn" type="default" onClick={() => { this.setState({ addvisible: true }) }}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="请输入内容"
						onSearch={value => console.log(value)}
						enterButton />
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]} />
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<DesignModal {...this.props} oncancel={() => { this.setState({ addvisible: false }) }} akey={Math.random() * 1234} onok={this.setData.bind(this)} />
				}
			</div>
		);
	}
}
