import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {Row, Col, Input, Button, Spin, message} from 'antd';
import {actions} from '../store/weekly';
import {actions as platformActions} from '_platform/store/global';
import {Tree, Form, Table} from '../components/Weekly';
const Search = Input.Search;

@connect(
	state => {
		const {overall: {weekly = {}}, platform} = state || {};
		return {...weekly, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Weekly extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAdd: false,
			treeLoading: false,
			tableLoading: false,
			selectKey: [],
			weeklyLists: [],
			keyWord: '',
			changeStatus: true,
		}
	}

	static propTypes = {};

	componentDidMount() {
		const {getTimeLine} = this.props.actions;
		getTimeLine({code: "WEEKLY_TIME_LINE"})
			.then(rst => {
				if (rst) {
					this.setState({
						treeLoading: false,
						changeStatus: false,
						selectKey: [`${rst.children[0].children[0].name}--${rst.children[0].children[0].code}--parent`]
					});
					this.getWeeklyListsFunc(rst.children[0].children[0].code)
				} else {
					this.setState({
						treeLoading: false,
						tableLoading: false,
					});
					message.warning('获取数据失败！')
				}
			})
	}

	//获取周报列表
	getWeeklyListsFunc(dirCode, obj) {
		const {getWeekly} = this.props.actions;
		let conditions = {};
		if (obj) {
			conditions.doc_name = obj;
		}
		getWeekly({dir_code: dirCode}, conditions)
			.then(rst => {
				let newWeeklyLists = rst.result;
				rst.result.map((week, index) => {
					newWeeklyLists[index].no = index + 1;
				});
				this.setState({
					tableLoading: false,
					weeklyLists: newWeeklyLists
				})
			})
	}

	//填写周报按钮
	toggleWeek(value) {
		// 刷新当前数据
		if (value) {
			this.setState({
				tableLoading: true,
				keyWord: ''
			});
			this.getWeeklyListsFunc(this.state.selectKey[0].split('--')[1])
		}
		this.setState({
			isAdd: !this.state.isAdd,
		})
	}

	timeLineSelect(value) {
		if (value.length === 0) {
			return
		}
		if (value[0].split('--')[2] === 'children') {
			return
		}
		this.getWeeklyListsFunc(value[0].split('--')[1]);
		this.setState({
			selectKey: value,
			tableLoading: true,
		})
	}

	searchChange(e) {
		this.setState({
			keyWord: e.target.value,
		})
	}

	search(value) {
		if (this.state.changeStatus) {
			return;
		}
		this.getWeeklyListsFunc(this.state.selectKey[0].split('--')[1], value)
	}

	render() {
		const {timeLines = [], actions: {createWeekly, openPreview, closeLoading}} = this.props;
		return (
			<Main>
				<DynamicTitle title="周报" {...this.props}/>
				<Sidebar>
					<Row>
						<Search
							placeholder="请输入关键字搜索"
							value={this.state.keyWord}
							onChange={this.searchChange.bind(this)}
							onSearch={this.search.bind(this)}/>
					</Row>
					<Row>
						<Spin spinning={this.state.treeLoading} tip="数据加载中，请稍等...">
							<Tree timeLines={timeLines} selectedKeys={this.state.selectKey}
							      onSelect={this.timeLineSelect.bind(this)}/>
						</Spin>
					</Row>
				</Sidebar>
				<Content>
					<Col span={24}>
						<Row type="flex" align="bottom" gutter={16}>
							<Col span={3}>
								<Button style={{width: '100%'}}
								        disabled={this.state.changeStatus ? true : false}
								        icon={this.state.isAdd ? 'close' : 'plus'} type="primary"
								        onClick={this.toggleWeek.bind(this, false)}>
									{this.state.isAdd ? '退出填写' : '周报填写'}
								</Button>
							</Col>
						</Row>
						<Row>
							{this.state.isAdd ?
								<Form onClick={this.toggleWeek.bind(this)} selectKey={this.state.selectKey}
								      createWeekly={createWeekly}/> :
								<Table
									openPreview={openPreview}
									closeLoading={closeLoading}
									weeklyLists={this.state.weeklyLists}
									tableLoading={this.state.tableLoading}/>}
						</Row>
					</Col>
				</Content>
			</Main>
		);
	}
}


