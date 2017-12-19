import React, {Component} from 'react';
import {Table, Row, Col} from 'antd';
import {DatePicker} from 'antd';
import moment from 'moment';

const {MonthPicker} = DatePicker;
const monthFormat = 'YYYY/MM';

export default class Lookout extends Component {

	static propTypes = {};

	render() {
		const {searchSelectedKey = '', searchInfo = {}} = this.props;
		const {
			peopleList = searchInfo['people-info'] || [],
			stay_days,
			check_days,
			real_check_days,
			stay,
			leave,
			in_people = searchInfo['in'] || 0
		} = searchInfo;
		return (
			<div>
				<Row>
					<Col span={12}>
						当前选择的单位：{searchSelectedKey.split('--')[1]}
					</Col>
					<Col span={12}>
						当前月份：
						<MonthPicker
							defaultValue={moment()}
							onChange={this._timeChange.bind(this)}
							format={monthFormat}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={6}>
						本月进场人数：{in_people}人
					</Col>
					<Col span={6}>
						本月离场人数：{leave}人
					</Col>
					<Col span={6}>
						本月驻场人数：{stay}人
					</Col>
					{/*<Col span={4}>*/}
						{/*本月要求驻场人数：{stay_days === -1 ? '暂无数据' : `${stay_days}人`}*/}
					{/*</Col>*/}
					<Col span={6}>
						本月出勤人天：{real_check_days === -1 ? '暂无数据' : `${real_check_days}人*天`}
					</Col>
					{/*<Col span={4}>*/}
						{/*本月要求出勤人天：{check_days === -1 ? '暂无数据' : `${check_days}人*天`}*/}
					{/*</Col>*/}
				</Row>
				<Table dataSource={peopleList} columns={this.columns} rowKey="id"/>
			</div>
		);
	}

	_timeChange(times) {
		const {searchSelectedKey, actions: {setSearchTimeAc, getSearchInfoAc, setLoadingAc}} = this.props;
		setSearchTimeAc({
			year: times.year(),
			month: times.month() + 1
		});
		setLoadingAc(true);
		getSearchInfoAc({
			code: searchSelectedKey.split('--')[0],
			year: times.year(),
			month: times.month() + 1
		}).then(() => {
			setLoadingAc(false);
		})
	}

	columns = [{
		title: '用户ID',
		dataIndex: 'id',
	}, {
		title: '姓名',
		dataIndex: 'name',
	}, {
		title: '职务',
		dataIndex: 'code',
		render: (text) => {
			const {personList} = this.props;
			let title_name = '暂无职务';
			let filterPerson=personList.filter(person => person.code == text);
			if(filterPerson.length > 0 && filterPerson[0].title !== ''){
				title_name=filterPerson[0].title;
			}
			return title_name;
		}
	}, {
		title: '进场时间',
		dataIndex: 'in',
		render: (text) => {
			if (text === '') {
				return '暂未入场'
			} else {
				return text
			}
		}
	}, {
		title: '离场时间',
		dataIndex: 'out',
		render: (text) => {
			if (text === null) {
				return '暂未离场'
			} else {
				return text
			}
		}
	}, {
		title: '出勤天数',
		dataIndex: 'dutylen',
	}
	// , {
	// 	title: '要求出勤天数',
	// 	dataIndex: 'person_check_days',
	// 	render: (text) => {
	// 		if (text === -1) {
	// 			return '暂无数据'
	// 		} else {
	// 			return text
	// 		}
	// 	}
	// }, {
	// 	title: '当前状态',
	// 	dataIndex: 'status',
	// 	render: (text) => {
	// 		if (text === 'L') {
	// 			return '离场'
	// 		} else if (text === 'I') {
	// 			return '进场'
	// 		} else {
	// 			return '驻场'
	// 		}
	// 	}
	// }
	];
}
