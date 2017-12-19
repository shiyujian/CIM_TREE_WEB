import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/notice';
import {actions as platformActions} from '_platform/store/global';
import Approval from '_platform/components/singleton/Approval';
import DocTree from '../components/DocTree';
import BlueprintForm from '../components/Blueprint';

@connect(
	state => {
		const {notice = {}, platform} = state.design || {};
		return {...notice, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Notice extends Component {

	static propTypes = {};

	render() {
		return (
			<Main>
				<DynamicTitle title="设计变更" {...this.props}/>
				<Sidebar>
					<DocTree {...this.props}/>
				</Sidebar>
				<Content>
					<BlueprintForm added={true} {...this.props}/>
					<Approval {...this.props} WORKFLOW_ID={ID} onSubmit={this.submit.bind(this)} onSuccess={this.goto.bind(this)}/>
				</Content>
			</Main>

		);
	}

	submit() {
		const {
			actions: {postDocument},
			parameters = [],
			sidebar: {node, stage} = {},
		} = this.props;
		const requests = parameters.map(param => {
			return postDocument({}, {
				code: param.code,
				name: param.name,
				obj_type: 'C_DOC',
				profess_folder: {
					code: node, obj_type: 'C_DIR',
				},
				basic_params: {
					files: [param]
				},
				extra_params: {
					remark: param.remark,
					type: param.type,
					time: param.lastModifiedDate,
					stage
				},
			})
		});
		return Promise.all(requests).then(files => {
			return files
		})
	}

	goto() {
		const {router} = this.props;
		router.push('/design/monitor')
	}
};
