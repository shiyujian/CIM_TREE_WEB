import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Content, DynamicTitle} from '_platform/components/layout';
import {Type, Filter, Table} from '../components/Monitor';

import {actions as platformActions} from '_platform/store/global';

@connect(
	state => {
		const { platform} = state;
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions}, dispatch),
	}),
)
class ExplainHandle extends Component {

	static propTypes = {};

    componentDidMount(){
        console.log('explain_handle_done !');
    }        
	render() {
		return (
			<Content>
				<DynamicTitle title="交底处理" {...this.props}/>
                交底处理
			</Content>
		);
	}
};

export default ExplainHandle;