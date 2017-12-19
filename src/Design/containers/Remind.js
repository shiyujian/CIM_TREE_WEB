/**
 * Created by tinybear on 17/8/15.
 * 进度提醒
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as planActions} from '../store/remind';
import {actions as plan1Actions} from '../store/plan';
import {DynamicTitle} from '_platform/components/layout';
import DesignRemindPanel from '../components/Remind';
import {Main, Aside, Body, Sidebar, Content} from '_platform/components/layout';

@connect(
	state => {
		const {overall:{remind = {},plan={}}, platform} = state || {};
		return { ...remind,platform,plan};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...planActions,...plan1Actions}, dispatch),
	}),
)
class DesignRemind extends Component{

	render(){
		return (<div>
            <DynamicTitle title="进度提醒" {...this.props}/>
			<DesignRemindPanel {...this.props}></DesignRemindPanel>
        </div>)
	}
}

export default DesignRemind;
