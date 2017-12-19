import React, {Component} from 'react';
import {Icon} from 'react-fa';
import simulate from '../components/DGN/simulate';
import {DatePicker, InputNumber, Slider, Row, Col,Select} from 'antd';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

export default class ProgressPlaybar extends Component {

	static propTypes = {};

	render() {
		const {player: {progress = 0, step = 1} = {}} = this.props;
		return (
			<Row>
				<Col span={24}>
					&nbsp;&nbsp;&nbsp;&nbsp;进度类型:
					<Select 
					 defaultValue="请选择进度类型" 
					 style={{ width: 120 }} 
					 onChange={this.selectHandleChange.bind(this)}>
						<Option value="1">计划进度</Option>
						<Option value="2">实际进度</Option>
				    </Select>
				    &nbsp;&nbsp;&nbsp;&nbsp;日期范围:
					<RangePicker showTime format="YYYY-MM-DD" onChange={this.onRangePickerChange.bind(this)} />
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Icon name="play-circle"
						  style={{
							  fontSize: '28px',
							  color: '#5db0cd',
							  lineHeight: '30px',
							  cursor: 'pointer'
						  }} onClick={this.play.bind(this)}/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Icon name="stop-circle"
						  style={{
							  fontSize: '28px',
							  color: '#5db0cd',
							  cursor: 'pointer'
						  }} onClick={this.stop.bind(this)}/>
					&nbsp;&nbsp;&nbsp;&nbsp; 步长：
					<InputNumber style={{width: '50px'}}
					 value={1}
					 disabled={this.props.playing === 'play'}
					 min={1} max={30}
					 onChange={this.onChange}/>天
					&nbsp;&nbsp;&nbsp;&nbsp; 间隔：
					<InputNumber style={{width: '50px'}}
					 value={step}
					 disabled={this.props.playing === 'play'}
					 min={.5} max={5} step={.5}
					 onChange={this.onDurationChange}/>秒
				</Col>
				<Col span={24}>
					<Slider min={0} max={5}
					 value={progress}
					 onChange={this.onChange}
					 onAfterChange={this.onAfterChange}/>
				</Col>
			</Row>);
	}

	onRangePickerChange(value){
		console.log('From: ', value[0], ', to: ', value[1]);
	}

	selectHandleChange(value) {
	  	console.log(`selected ${value}`);
	}

	play() {
		const {player: {playing, step = 1} = {}} = this.props;
		if (!playing) {
			this.timer = setInterval(this.progress.bind(this), step * 1000);
		}
	}

	progress() {
		debugger
		console.log('this.props',this.props)
		const {player: {playing, step = 1, progress=0} = {}, actions: {play}} = this.props;
		const list = this.getList();
		const node = this.getProgressNode();
		debugger
		try {
			if(!playing){
				simulate.OnBeginSimulate();
				console.log('ssssssssss')
			}
		}
		catch(e){
			console.log('error111',e)
		}
		
		debugger
		play();
		try{
			simulate.ClearElementList(0,2);
			simulate.ClearElementList(0,3);
		}
		catch(e){
			console.log('error222',e)
		}
		
		
		// 施工完成的区域
		list.forEach(item=>{
			// simulate.ClearElementList(0,2);
			// simulate.ClearElementList(0,3);
			simulate.AddElmToList(item.code, 0, 3);
		});

		//<:TODO 额外代码，由于node报错，会不断执行下去。
		if(!node){
			this.stop.bind(this);
		}
		//:>
		else{
			// 正在施工的区域
			try{
					simulate.AddElmToList(node.code, 0 ,2);
					simulate.SetSimulateDate(0, node['计划开始时间']);
					simulate.OnStartSimulate(false, true);
			}
			catch(e){
				console.log('error333',e)
			}
			
		}
	}

	getProgressNode(){
		const {listData=[], player: {playing, step = 1, progress=0} = {}} = this.props;
		return listData[progress];
	}

	getList(){
		const {listData=[], player: {playing, step = 1, progress=0} = {}} = this.props;
		return listData.filter((item, index)=>{
			return index < progress;
		});
	}

	stop() {
		const {player: {playing} = {}, actions: {stop}} = this.props;
		if (playing) {
			stop();
			clearInterval(this.timer);
		}
		try{
			// 让模型停止下来
			simulate.OnStopSimulate(true);
		}
		catch(e){
			console.log('error444',e)
		}
		
	}

	onDurationChange() {

	}

	onChange() {

	}

	onAfterChange() {

	}
}
