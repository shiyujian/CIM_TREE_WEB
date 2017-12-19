import React, {Component} from 'react';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/inspection';
import {actions as platformActions} from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import {Filter, Table} from '../components/Inspection';
import Approval from '_platform/components/singleton/Approval';

@connect(
	state => {
		const {quality: {inspection = {}} = {}, platform} = state || {};
		return {...inspection, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Inspection extends Component {

	static propTypes = {};

	render() {
		const {tree = [], currentNode = {}} = this.props;

		return (
			<Main>
				<DynamicTitle title="表单配置及查询" {...this.props}/>
				<Sidebar>
					<PkCodeTree treeData={tree}
					            selectedKeys={currentNode}
					            onSelect={this.onSelect.bind(this)}/>
				</Sidebar>
				<Content>
					<Filter {...this.props}/>
					<Table {...this.props}/>
					<Approval {...this.props} WORKFLOW_ID={ID} onSubmit={this.submit.bind(this)}/>
				</Content>
			</Main>
		);
	}

	componentDidMount() {
		const {actions: {getTree, getqictypelist}} = this.props;
		getqictypelist();
		getTree({}, {depth: '4'}).then(({children}) => {
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

	submit() {
	}
}