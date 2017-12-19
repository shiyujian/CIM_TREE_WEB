import React, {Component} from 'react';
import {Row, Col} from 'antd';
import ReactEcharts from 'react-echarts';
import {DatePicker} from 'antd';
import moment from 'moment';
moment.locale('zh-cn');

moment.locale('zh-cn');

const {RangePicker, MonthPicker} = DatePicker;
const monthFormat = 'YYYY/MM';
export default class Statistics extends Component {

	static propTypes = {};

	onStartChange(value) {
		const {countTime, actions: {setCountTimeAc}} = this.props;
		const {toyear, tomonth} = countTime;
		this.onChange('startValue', value);
		this.setState({
			openEndChose: true,
		});
		setCountTimeAc({
			fromyear: value.year(),
			frommonth: value.month() + 1,
			toyear: toyear || moment().year(),
			tomonth: tomonth || moment().month() + 1
		});

	}

	onEndChange(value) {
		const {countSelectedKey, countTime, actions: {setCountTimeAc, getCountInfoAc, setLoadingAc,setCountInfoAc,getCountInfoAcT}} = this.props;
		const {fromyear, frommonth} = countTime;
		this.onChange('endValue', value);
		this.setState({
			openEndChose: false,
		});
		let allMonth=this._getOptionsArr(countSelectedKey.split('--')[0],fromyear,frommonth,value.year(),value.month() + 1)
		let allPromises=allMonth.map((item)=>{
			return getCountInfoAcT(item)
		})
		setLoadingAc(true);
		Promise.all(allPromises).then(rst=>{
			let allData=[]
			rst.map((itm)=>{
				allData=allData.concat(itm)
			})
			setCountInfoAc(allData)
			setLoadingAc(false);
		}).catch(()=>{
			setCountInfoAc([])
			setLoadingAc(false);
		})
		setCountTimeAc({
			fromyear: fromyear,
			frommonth: frommonth,
			toyear: value.year(),
			tomonth: value.month() + 1,
		});
	}

	_getOptionsArr(code, fromyear, frommonth, toyear, tomonth) {
		let arr = [];
		let l_y=Number(toyear) - Number(fromyear);
		let l_m=Number(tomonth) - Number(frommonth);
		if(l_y === 0){ //同一年
			for(let j = 0;j <= l_m;j++){
				let obj = {
					code: code,
					fromyear: fromyear,
					frommonth: frommonth+j,
					toyear: fromyear,
					tomonth: frommonth+j,
				}
				arr.push(obj)
			}
		}else{ //不同年
			for(let i = 0;i <= l_y;i++){
				if(Number(fromyear) + i === Number(fromyear)){ //开头年
					for(let k = 0;k <= 12-Number(frommonth);k++){
						let obj = {
							code: code,
							fromyear: Number(fromyear),
							frommonth: Number(frommonth)+k,
							toyear: Number(fromyear),
							tomonth: Number(frommonth)+k,
						}
						arr.push(obj)
					}
				}else if(Number(fromyear) + i === Number(toyear)){ //结束年
					for(let l = 1;l <= Number(tomonth);l++){
						let obj = {
							code: code,
							fromyear: Number(toyear),
							frommonth: l,
							toyear: Number(toyear),
							tomonth: l,
						}
						arr.push(obj)
					}
				}else{ //中间年
					for(let m = 1;m <= 12;m++){
						let obj = {
							code: code,
							fromyear: Number(fromyear) + i,
							frommonth: m,
							toyear: Number(fromyear) + i,
							tomonth: m,
						}
						arr.push(obj)
					}
				}
			}
		}
		return arr;
	}

	handleEndOpenChange() {
		this.setState({
			openEndChose: true,
		})
	}

	constructor(props) {
		super(props);
		this.state = {
			openEndChose: false,
			startValue: moment(),
			endValue: moment(),
		}
	}
	
	onChange = (field, value) => {
		this.setState({
			[field]: value,
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

	render() {
		const {countSelectedKey = '',countInfo = []} = this.props;
		return (
			<div>
				<Row>
					<Col span={12}>
						当前选择的单位：{countSelectedKey.split('--')[1]}
					</Col>
					<Col span={12}>
						统计时间：
						<MonthPicker
							disabledDate={this.disabledStartDate.bind(this)}
							allowClear={false}
							value={this.state.startValue}
							// defaultValue={moment()}
							placeholder="请选择开始月份"
							onChange={this.onStartChange.bind(this)}/>
						<MonthPicker
							disabledDate={this.disabledEndDate.bind(this)}
							allowClear={false}
							value={this.state.endValue}
							// defaultValue={moment()}
							placeholder="请选择结束月份"
							open={this.state.openEndChose}
							onOpenChange={this.handleEndOpenChange.bind(this)}
							onChange={this.onEndChange.bind(this)}/>
						{/*<RangePicker*/}
						{/*defaultValue={[moment(), moment()]}*/}
						{/*onChange={this._timeChange.bind(this)}*/}
						{/*format={monthFormat}*/}
						{/*/>*/}
					</Col>
				</Row>
				<Row>
					{
						countInfo.length &&
						<Col span={12}>
							{countSelectedKey.split('--')[1]}{this._getText()}进、离、驻场考勤情况
							<ReactEcharts
								option={this._getOptions_1()}
								style={{height: '400px', width: '100%'}}
							/>
						</Col>
					}
					{
						countInfo.length &&
						<Col span={12}>
							{countSelectedKey.split('--')[1]}{this._getText()}人员出勤情况
							<ReactEcharts
								option={this._getOptions_2()}
								style={{height: '400px', width: '100%'}}
							/>
						</Col>
					}
					{
						countInfo.length &&
						<Col span={24}>
							{countSelectedKey.split('--')[1]}{this._getText()}整体考勤情况
							<ReactEcharts
								option={this._getOptions_3()}
								style={{height: '400px', width: '100%'}}
							/>
						</Col>
					}
				</Row>
			</div>
		);
	}

	_getText() {
		const {countTime} = this.props;
		let text = "";
		const {fromyear, frommonth, toyear, tomonth} = countTime;
		if (fromyear === toyear && frommonth === tomonth) {
			text = fromyear + "年" + frommonth + "月"
		} else {
			text = fromyear + "年" + frommonth + "月至" + toyear + "年" + tomonth + "月"
		}
		return text;
	}

	_timeChange(times) {
		const {countSelectedKey, actions: {setCountTimeAc, getCountInfoAc, setLoadingAc}} = this.props;
		setCountTimeAc({
			fromyear: times[0].year(),
			frommonth: times[0].month() + 1,
			toyear: times[1].year(),
			tomonth: times[1].month() + 1
		});
		setLoadingAc(true);
		getCountInfoAc({
			code: countSelectedKey.split('--')[0],
			fromyear: times[0].year(),
			frommonth: times[0].month() + 1,
			toyear: times[1].year(),
			tomonth: times[1].month() + 1
		}).then(() => {
			setLoadingAc(false);
		})
	}

	_getOptions_1() {
		const {countInfo = []} = this.props;
		let options = {
			color: ['#5e9cd3', '#eb7d3c', '#a5a5a5', '#febf2d'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			toolbox: {
				feature: {
					saveAsImage: {show: true}
				}
			},
			legend: {
				data: ['进场人数', '离场人数', '驻场人数']
				// data: ['进场人数', '离场人数', '驻场人数', '要求驻场人数']
			},
			xAxis: [
				{
					type: 'category',
					data: [],
					name: '月'
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '人'
				}
			],
			series: [
				{
					name: '进场人数',
					type: 'bar',
					data: []
				},
				{
					name: '离场人数',
					type: 'bar',
					data: []
				},
				{
					name: '驻场人数',
					type: 'bar',
					data: []
				}
				// ,
				// {
				// 	name: '要求驻场人数',
				// 	type: 'bar',
				// 	data: []
				// }
			]
		};
		countInfo.map((info) => {
			options.xAxis[0].data.push(info.month);
			options.series[0].data.push(info.in === -1 ? 0 : info.in);
			options.series[1].data.push(info.leave === -1 ? 0 : info.leave);
			options.series[2].data.push(info.stay === -1 ? 0 : info.stay);
			// options.series[3].data.push(info.stay_days === -1 ? 0 : info.stay_days);
		});
		return options;
	}

	_getOptions_2() {
		const {countInfo = []} = this.props;
		let options = {
			color: ['#5e9cd3', '#eb7d3c', '#a5a5a5', '#febf2d'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			toolbox: {
				feature: {
					saveAsImage: {show: true}
				}
			},
			legend: {
				data: ['出勤人数']
				// data: ['出勤人数', '要求出勤人数']
			},
			xAxis: [
				{
					type: 'category',
					data: [],
					name: '月'
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '人天'
				}
			],
			series: [
				{
					name: '出勤人数',
					type: 'bar',
					data: []
				}
				// ,
				// {
				// 	name: '要求出勤人数',
				// 	type: 'bar',
				// 	data: []
				// }
			]
		};
		countInfo.map((info) => {
			options.xAxis[0].data.push(info.month);
			options.series[0].data.push(info.real_check_days === -1 ? 0 : info.real_check_days);
			// options.series[1].data.push(info.check_days === -1 ? 0 : info.check_days);
		});
		return options;
	}

	_getOptions_3() {
		const {countInfo = []} = this.props;
		let options = {
			color: ['#5e9cd3', '#eb7d3c', '#a5a5a5', '#febf2d'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			toolbox: {
				feature: {
					saveAsImage: {show: true}
				}
			},
			legend: {
				data: ['早退率', '迟到率', '缺卡率']
			},
			xAxis: [
				{
					type: 'category',
					data: [],
					name: '月'
				}
			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {
						formatter: '{value} %'
					},
					max: '100'
				}
			],
			series: [
				{
					name: '早退率',
					type: 'line',
					data: []
				},
				{
					name: '迟到率',
					type: 'line',
					data: []
				},
				{
					name: '缺卡率',
					type: 'line',
					data: []
				}
			]
		};
		countInfo.map((info) => {
			options.xAxis[0].data.push(info.month);
			options.series[0].data.push(info.earlyrate === -1 ? 0 : info.earlyrate * 100);
			options.series[1].data.push(info.laterate === -1 ? 0 : info.laterate * 100);
			options.series[2].data.push(info.uncheckrate === -1 ? 0 : info.uncheckrate * 100);
		});
		return options;
	}
}
