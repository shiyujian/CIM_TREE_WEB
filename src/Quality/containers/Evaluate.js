import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import PkCodeTree from '../components/PkCodeTree';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions, ID} from '../store/evaluate';
import {actions as platformActions} from '_platform/store/global';
import Filter from '../components/Evaluate/Filter';
import Approval from '_platform/components/singleton/Approval';

@connect(
	state => {
		const {quality: evaluate = {}, platform} = state.quality || {};
		return {...evaluate, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Evaluate extends Component {

	static propTypes = {};

	render() {
		const {tree = [], currentNode = {}} = this.props;
		return (
			<Main>
				<DynamicTitle title="质量评定" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={tree}
					            selectedKeys={currentNode.code}
					            onSelect={this.onSelect.bind(this)}/>
				</Sidebar>
				<Content>
					<Filter {...this.props} />
					<Approval {...this.props} WORKFLOW_ID={ID} onSubmit={this.submit.bind(this)}/>
				</Content>
			</Main>
		);
	}

	componentDidMount() {
		const {actions: {getTree, setCurrentNode}} = this.props;
		getTree({}, {depth: '4'}).then(({children}) => {
			//setCurrentNode(children.code)
		});
	}

	onSelect(value = []) {
		const [code] = value;
		const {actions: {getChildrenWorkPackages, setSectionWorkPackages, setSubSectionWorkPackages, setItemWorkPackages}} = this.props;
		if (code.indexOf('--子单位') !== -1) {
			getChildrenWorkPackages({code: code.split("--")[1]}).then(({children_wp}) => {
				setSectionWorkPackages(children_wp);
			});
		} else {
			setSectionWorkPackages([]);
			setSubSectionWorkPackages([]);
			setItemWorkPackages([]);
		}
	}

	submit() {
	}
}


