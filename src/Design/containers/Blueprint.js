import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {message} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/blueprint';
import {actions as platformActions} from '_platform/store/global';
import Approval from '_platform/components/singleton/Approval';
import DocTree from '../components/DocTree';
import BlueprintForm from '../components/Blueprint';

@connect(
	state => {
		const {blueprint = {}, platform} = state.design || {};
		return {...blueprint, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Blueprint extends Component {

	static propTypes = {};

	render() {
		return (
			<Main>
				<DynamicTitle title="设计报审" {...this.props}/>
				<Sidebar>
					<DocTree {...this.props}/>
				</Sidebar>
				<Content>
					<BlueprintForm {...this.props}/>
					<Approval {...this.props} WORKFLOW_ID={ID} onSubmit={this.submit.bind(this)} onSuccess={this.goto.bind(this)}/>
				</Content>
			</Main>

		);
	}

	submit() {
		const {
			parameters = [],
			sidebar: {node, stage} = {},
			actions: {postDocument},
		} = this.props;
		if (!parameters.length) {
			message.error('请先上传文件');
		} else {
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
						// searchProject: searchProject,
						// nameProject: nameProject,
						// nameUnit: nameUnit,
					},
				})
			});
			return Promise.all(requests).then(docs => {
				return docs.map(doc => ({
					id: doc.pk,
					code: doc.code,
					type: doc.obj_type,
					name: doc.name
				}))
			})
		}
	}

	goto() {
		const {router} = this.props;
		router.push('/design/monitor')
	}
};
