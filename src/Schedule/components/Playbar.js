import React, {Component} from 'react';
import {DatePicker, InputNumber, Slider, Row, Col} from 'antd';
import {Icon} from 'react-fa';
import simulate from '../components/DGN/simulate';

export default class Playbar extends Component {

	static propTypes = {};

	render() {
		const {player: {progress = 0, step = 1} = {}} = this.props;
		return (
			<Row>
				<Col span={12}>
					<Icon name="play-circle"
						  style={{
							  fontSize: '28px',
							  color: '#5db0cd',
							  lineHeight: '30px',
							  cursor: 'pointer'
						  }} onClick={this.play.bind(this)}/>
					&nbsp;&nbsp;
					<Icon name="stop-circle"
						  style={{
							  fontSize: '28px',
							  color: '#5db0cd',
							  cursor: 'pointer'
						  }} onClick={this.stop.bind(this)}/>
					&nbsp;&nbsp; 步长：
					<InputNumber style={{width: '50px'}}
								 value={1}
								 disabled={this.props.playing === 'play'}
								 min={1} max={30}
								 onChange={this.onChange}/>天
					&nbsp;&nbsp; 间隔：
					<InputNumber style={{width: '50px'}}
								 value={step}
								 disabled={this.props.playing === 'play'}
								 min={.5} max={5} step={.5}
								 onChange={this.onDurationChange}/>秒
					<DatePicker format='YYYY-MM-DD'/>
				</Col>
				<Col span={12}>
					<Slider min={0} max={30}
							value={progress}
							onChange={this.onChange}
							onAfterChange={this.onAfterChange}/>
				</Col>
			</Row>);
	}

	play() {
		const {player: {playing, step = 1} = {}} = this.props;
		if (!playing) {
			this.timer = setInterval(this.progress.bind(this), step * 1000);
		}
	}

	progress() {
		const {player: {playing, step = 1, progress=0} = {}, actions: {play}} = this.props;
		const list = this.getList();
		const node = this.getProgressNode();
		if(!playing){
			simulate.OnBeginSimulate();
		}
		play();
		simulate.ClearElementList(0,2);
		simulate.ClearElementList(0,3);
		
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
			simulate.AddElmToList(node.code, 0 ,2);

			simulate.SetSimulateDate(0, node['计划开始时间']);
			simulate.OnStartSimulate(false, true);
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
		// 让模型停止下来
		simulate.OnStopSimulate(true);
	}

	onDurationChange() {

	}

	onChange() {

	}

	onAfterChange() {

	}
}
