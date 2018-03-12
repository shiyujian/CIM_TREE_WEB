import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {Row, Col, DatePicker, Button, Spin} from 'antd';
import ReactEcharts from 'react-echarts';

import {VictoryChart, VictoryGroup, VictoryBar} from 'victory';
// import data from './people.json';
// import {getUser} from '_platform/auth';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const {RangePicker, MonthPicker} = DatePicker;

// var echarts = require('echarts');

export default class Overall extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			data: {},
			openEndChose: false,
			startValue: moment(),
			endValue: moment(),
			// loading: true
		}
	}

	componentDidMount() {

		let {
			actions: {
				getOrgAttendInfo,
				getCurrentUserOrgCode,
				setMonthSection
			},
			thisOrgCode = ''
		} = this.props;


		setMonthSection({
			fromyear: moment().year(),
			frommonth: moment().month() + 1,
			toyear: moment().year(),
			tomonth: moment().month() + 1,
		});

		// let {id} = getUser();


		// getCurrentUserOrgCode({userId:id}).then((rst)=>{
		// 	console.log('# rst : ',rst);
		getOrgAttendInfo({
			//TOFIX:管理员账户无法获取当前用户组织名称,当管理员登录时写死
			// org_code:rst.account?
			// rst.account.org_code?rst.account.org_code:window.DeathCode.OVERALL_APPROVAL_UNIT_CODE
			// :window.DeathCode.OVERALL_APPROVAL_UNIT_CODE,

			fromyear: moment().year(),
			frommonth: moment().month() + 1,
			toyear: moment().year(),
			tomonth: moment().month() + 1,
		}).then(
			() => {
				this.makeData()
				this.setState({
					loading:false
				})
			}
		);
		// }).then(
		// 	()=>{this.lookChart()}
		// );

	}

	makeData() {
		const {orgAttendInfo = []} = this.props;
		let months = [], inner = [], out = [], allIn = [];

		orgAttendInfo.forEach(
			(monthAttend) => {
				months.push(monthAttend.month + '月');
				inner.push(monthAttend.in);
				out.push(monthAttend.leave);
				allIn.push(monthAttend.stay);
			}
		);

		let data = {'months': months, 'inner': inner, 'out': out, 'allIn': allIn};

		this.setState({data});
		console.log('# makeData: done! # data : ', data);

	}

	onStartChange(value) {
		const {monthSection, actions: {setMonthSection}} = this.props;
		const {toyear = moment().year(), tomonth = moment().month() + 1} = monthSection;
		this.setState({
			openEndChose: true
		});
		this.onChange('startValue', value);
		setMonthSection({
			fromyear: value.year(),
			frommonth: value.month() + 1,
			toyear: toyear || moment().year(),
			tomonth: tomonth || moment().month() + 1
		});
	}

	onEndChange(value) {
		this.setState({
			openEndChose: false,
		});
		this.onChange('endValue', value);
		const {monthSection, actions: {setMonthSection}} = this.props;
		setMonthSection({
			...monthSection,
			toyear: value.year(),
			tomonth: value.month() + 1
		});
	}

	_getOptionsArr(fromyear, frommonth, toyear, tomonth) {
		let arr = [];
		let l_y=Number(toyear) - Number(fromyear);
		let l_m=Number(tomonth) - Number(frommonth);
		if(l_y === 0){ //同一年
			for(let j = 0;j <= l_m;j++){
				let obj = {
					fromyear: fromyear,
					frommonth: frommonth+j,
					toyear: fromyear,
					tomonth: frommonth+j
				}
				arr.push(obj)
			}
		}else{ //不同年
			for(let i = 0;i <= l_y;i++){
				if(Number(fromyear) + i === Number(fromyear)){ //开头年
					for(let k = 0;k <= 12-Number(frommonth);k++){
						let obj = {
							fromyear: Number(fromyear),
							frommonth: Number(frommonth)+k,
							toyear: Number(fromyear),
							tomonth: Number(frommonth)+k
						}
						arr.push(obj)
					}
				}else if(Number(fromyear) + i === Number(toyear)){ //结束年
					for(let l = 1;l <= Number(tomonth);l++){
						let obj = {
							fromyear: Number(toyear),
							frommonth: l,
							toyear: Number(toyear),
							tomonth: l
						}
						arr.push(obj)
					}
				}else{ //中间年
					for(let m = 1;m <= 12;m++){
						let obj = {
							fromyear: Number(fromyear) + i,
							frommonth: m,
							toyear: Number(fromyear) + i,
							tomonth: m
						}
						arr.push(obj)
					}
				}
			}
		}
		return arr;
	}

	lookChart() {
		// this.setState({
		// 	loading:true
		// })
		// let {
		// 	thisOrgCode,
		// 	monthSection,
		// 	actions: {getOrgAttendInfo,setCountInfoAc,getOrgAttendInfoT}
		// } = this.props;
		// let allMonth=this._getOptionsArr(monthSection.fromyear,monthSection.frommonth,monthSection.toyear,monthSection.tomonth)
		// let allPromises=allMonth.map((item)=>{
		// 	return getOrgAttendInfoT(item)
		// })
		// Promise.all(allPromises).then(rst=>{
		// 	let allData=[]
		// 	rst.map((itm)=>{
		// 		allData=allData.concat(itm)
		// 	})
		// 	setCountInfoAc(allData)
		// 	this.setState({
		// 		loading:false
		// 	})
		// 	this.makeData()
		// }).catch(()=>{
		// 	setCountInfoAc([])
		// 	this.setState({
		// 		loading:false
		// 	})
		// })
	}

	getEchartsOption() {

		let options = {
			color: ['#1abc9c', '#f39c12', '#409ad0'],
			textStyle: {color: '#fff', fontSize: 13},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#000'
					}
				}
			},
			toolbox: {
				feature: {
					// dataView: {show: true, readOnly: false},
					// magicType: {show: true, type: ['line', 'bar']},
					// restore: {show: true},
					// saveAsImage: {show: true}
				}
			},
			legend: {
				data: ['进场人员', '离场人员', '驻场人员'],
				textStyle: {color: '#000', fontSize: 13}
			},
			xAxis: [
				{
					type: 'category',
					data: this.state.data['months'],
					axisPointer: {
						type: 'shadow'
					},
					axisLabel: {
						textStyle: {color: '#000', fontSize: 13}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '进离场人员数量',
					textStyle: {color: '#000', fontSize: 13},
					min: 0,
					interval: 5,
					axisLabel: {
						formatter: '{value}',
						textStyle: {color: '#000', fontSize: 13}
					}
				},
				{
					type: 'value',
					name: '驻场人员数量',
					min: 0,
					interval: 5,
					axisLabel: {
						formatter: '{value}',
						textStyle: {color: '#000', fontSize: 13}
					}
				}
			],
			series: [
				{
					name: '进场人员',
					type: 'line',
					data: this.state.data['inner'],
					itemStyle: {
						normal: {
							barBorderRadius: 5
						},
						emphasis: {
							barBorderRadius: 5
						}
					}
				},
				{
					name: '离场人员',
					type: 'line',
					data: this.state.data['out'],
					itemStyle: {
						normal: {
							barBorderRadius: 5
						},
						emphasis: {
							barBorderRadius: 5
						}
					}
				},
				{
					name: '驻场人员',
					type: 'bar',
					barWidth: '30%',
					yAxisIndex: 1,
					data: this.state.data['allIn'],
					itemStyle: {
						normal: {
							barBorderRadius: 5
						},
						emphasis: {
							barBorderRadius: 5
						}
					}
				}
			]
		};

		return options;

	}

	handleEndOpenChange() {
		this.setState({
			openEndChose: true,
		})
	}

	onChange = (field, value) => {
		this.setState({
			[field]: value
		});
	};
	disabledStartDate = (startValue) => {
		const endValue = this.state.endValue;
		return startValue.isAfter(endValue);
	};
	disabledEndDate = (endValue) => {
		const startValue = this.state.startValue;
		return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() >= moment().valueOf();
	};

	render() {//todo 人员统计具体实现
		const {orgAttendInfo = []} = this.props;
		// let {loading = true} = this.state;
		return (
			<Blade title="质量信息统计">
				{/* <Spin tip="数据加载中，请稍后..." spinning={loading}> */}
					<Col>
						{/* <div style={{display: 'flex', alignItems: 'center'}}>
							统计时间：
							<MonthPicker
								allowClear={false}
								value={this.state.startValue}
								disabledDate={this.disabledStartDate.bind(this)}
								placeholder="请选择开始月份"
								onChange={this.onStartChange.bind(this)}/>
							<MonthPicker
								allowClear={false}
								value={this.state.endValue}
								disabledDate={this.disabledEndDate.bind(this)}
								placeholder="请选择结束月份"
								open={this.state.openEndChose}
								onOpenChange={this.handleEndOpenChange.bind(this)}
								onChange={this.onEndChange.bind(this)}
							/>
							<Button onClick={this.lookChart.bind(this)}>查看统计</Button>
						</div> */}
					</Col>

					<div id='homeChart1' style={{width: '100%', height: '360px'}}>
						{
							orgAttendInfo.length &&
							<ReactEcharts
								option={this.getEchartsOption()}
							/>
						}
					</div>
				{/* </Spin> */}
			</Blade>

		);
	}
}
