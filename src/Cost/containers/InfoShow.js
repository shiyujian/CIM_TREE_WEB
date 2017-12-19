import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import InfoShowTab from '../components/InfoShow/InfoShowTab'
import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;
@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions}, dispatch),
	}),
)
export default class InfoShow extends Component {
	constructor(props) {
        super(props);
        this.state = {
            subsection:[]//分部选项
        };
    }
	static propTypes = {};
	componentWillReceiveProps(props){
		let {subsection} = props;
		this.setState({subsection});
	}
	callback(key) {
  		console.log(key);
	}
	render() {
		return (
			<div>
				<DynamicTitle title="工程量信息展示" {...this.props}/>
				<Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
				    <TabPane tab="概算" key="1">
				    	<InfoShowTab type='0'/>
				    </TabPane>
				    <TabPane tab="合同" key="2">
				    	<InfoShowTab type='1'/>
				    </TabPane>
				    <TabPane tab="结算" key="3">
				    	<InfoShowTab type='2'/>
				    </TabPane>
				</Tabs>
			</div>);
	}
}
