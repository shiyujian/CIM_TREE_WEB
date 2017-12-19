import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TabContent from '../components/DataMaintenance/TabContent'
import {Tabs} from 'antd';
import {NODE_FILE_EXCHANGE_API} from '_platform/api';
const TabPane = Tabs.TabPane;
@connect(
	state => {
		const {cost:{dataMaintenance = {jxka:'1213'}},platform} = state;
		return {...dataMaintenance,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions,...platformActions}, dispatch),
	}),
)

export default class DataMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subsection:[]//分部选项
        };
    }
	static propTypes = {};

	componentDidMount(){
	
	}
	componentWillReceiveProps(props){
		let {subsection} = props;
		this.setState({subsection});
	}
	callback(key) {
  		console.log(key);
	}
	render() {
		let {subsection} = this.state;
		return(
			<div>
				<DynamicTitle title="工程量数据维护" {...this.props}/>
				<Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
				    <TabPane tab="概算" key="1" >
				    	<TabContent type='0' subsection={subsection}/>
				    </TabPane>
				    <TabPane tab="合同" key="2">
				    	<TabContent type='1' subsection={subsection}/>
				    </TabPane>
				    <TabPane tab="结算" key="3">
				    	<TabContent type='2' subsection={subsection}/>
				    </TabPane>
				</Tabs>
			</div>
		);
	}
}
