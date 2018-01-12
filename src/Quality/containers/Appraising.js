import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/cell';
import {actions as platformActions} from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import {Filter, Table} from '../components/Appraising';


@connect(
	state => {
		const {quality: {cell = {}}, platform} = state || {};
		console.log(state);
		return {...cell, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Appraising extends Component {
	static propTypes = {};

	render() {

		const {tree = [], currentNode = {}} = this.props;

		return (
			<Main>
				<DynamicTitle title="检验批填报" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={tree}
					            selectedKeys={currentNode.code}
					            onSelect={this.onSelect.bind(this)}/>
				</Sidebar>
				<Content>
					<Filter  {...this.props}/>
					<Table {...this.props}/>
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
		const {actions: {changeFilterField,getSections, setSection, setSubsection, setItem}} = this.props;
		if (code.indexOf('--子单位') !== -1) {
            getSections({code: code.split("--")[1]}).then(({children_wp}) => {
				setSection(children_wp);
			});
		} else {
			setSection([]);
            setSubsection([]);
			setItem([]);
		}
        changeFilterField('section', undefined);
        changeFilterField('subSection', undefined);
        setSubsection([]);
        changeFilterField('item', undefined);
        setItem([]);
	}
}
