import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Content, DynamicTitle} from '_platform/components/layout';
import {Type, Filter, Table} from '../components/Monitor';
import {actions as designExpActions} from '../store/designExp';
import {actions as platformActions} from '_platform/store/global';
import QueryPanel from '../components/Explain/QueryPanel'

@connect(
	state => {
		const { overall:{designExp = {}},platform} = state;
		return { ...designExp,platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...designExpActions,...platformActions}, dispatch),
	}),
)
class ExplainQuery extends Component {

	static propTypes = {};
	
	render() {		
		return (
			<Content>
				<DynamicTitle title="交底查询" {...this.props}/>
                交底查询
				<QueryPanel {...this.props}/>
			</Content>
		);
	}
};

export default ExplainQuery;