import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Content} from '_platform/components/layout';
import {Radio} from 'antd';
import {actions} from '../store/fill';
import {Allfill} from '../components/Fill/'
import {Planfill} from '../components/Fill/'
import {Practicalfill} from '../components/Fill/'
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(
	state => {
		const {fill = {}} = state.schedule || {};
		return fill;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch)
	})
)
export default class Fill extends Component {
	static propTypes = {
		name: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {radioValue = 'all'} = this.props;
		return (
			<Content>
				<div style={{textAlign: 'center', marginBottom: 20}}>
					<RadioGroup value={radioValue}
								onChange={this.chaneType.bind(this)}>
						{
							Fill.types.map((type, index) => {
								return <RadioButton key={index}
													value={type.value}>
									{type.label}
								</RadioButton>;
							})
						}
					</RadioGroup>
				</div>
				{
					(radioValue === 'all') ? (
						<Allfill {...this.props}/>
					) : (
						(radioValue === 'plan') ? (
							<Planfill {...this.props}/>
						) : (
							<Practicalfill {...this.props}/>
						)
					)
				}
			</Content>
		);
	}

	chaneType(event) {
		event.preventDefault();
		const {actions: {radioToggle}} = this.props;
		const value = event.target.value;
		radioToggle(value);
		this.reset();
	}

	componentWillUnmount() {
		const {actions: {radioToggle}} = this.props;
		radioToggle('all');
		this.reset();
	}

	reset() {
		const {actions: {changeFilterField, loadToggle}} = this.props;
		//重置参数
		changeFilterField('project', undefined);
		changeFilterField('unit', undefined);
		changeFilterField('section', undefined);
		changeFilterField('item', undefined);
		loadToggle(false);
	}

	static types = [
		{
			label: '总进度报审',
			value: 'all'
		}, {
			label: '计划填报',
			value: 'plan'
		}, {
			label: '实际填报',
			value: 'practical'
		}
	];
};
