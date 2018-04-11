import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import reducer, {actions} from '../store/index';
import reducer, { actions } from '../store/redios.js';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
// import { Filter, Table, Addition, Updatemodal, Tree, ImageInfo } from '../components/Redios'
import {Filter, Table,Addition,Updatemodal,DatumTree} from '../components/Redios'

import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
export const Datumcode = window.DeathCode.DATUM_GCYX;

@connect(
	state => {
		const { datum: { redios = {} }, platform } = state || {};
		return { ...redios, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions }, dispatch)
	})
)
// @connect(
// 	state => {
// 		const {datum = {}, platform} = state || {};
// 		return {...datum, platform};
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
// 	})
// )
export default class Redios extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isTreeSelected: false,
			loading:false,
			parent:''
        }
	}

	render() {
		const {
            tree=[],
            Doc=[],
            keycode,
        } = this.props;
		return (
			<Body>
				<Main>
				<DynamicTitle title="影像资料" {...this.props}/>
				<Sidebar>
					<DatumTree treeData={tree}
								selectedKeys={keycode}
								onSelect={this.onSelect.bind(this)}
								{...this.state}/>
				</Sidebar>
				<Content>
					<Filter  {...this.props} {...this.state}/>
					<Table {...this.props} {...this.state}/>
				</Content>
				<Addition {...this.props}  {...this.state}/>
			</Main>
			<Updatemodal {...this.props} {...this.state}/>
			<Preview/>
			</Body>
		)
	}
	componentDidMount() {
		const { actions: { getTree } } = this.props;
		this.setState({ loading: true });
		getTree({ code: Datumcode }).then(({ children }) => {
			this.setState({ loading: false });
		});
		if (this.props.Doc) {
			this.setState({ isTreeSelected: true })
		}
	}
	onSelect(value = [], e) {
		const [code] = value;
		const { actions: { getdocument, setcurrentcode, setkeycode } } = this.props;
		setkeycode(code);
		if (code === undefined) {
			return
		}
		let parent = code.split("--")[3]
		console.log('parent',parent)
		this.doc_type = e.node.props.title;
		this.setState({
			isTreeSelected:e.selected,
			parent:parent,
			selectDoc:e.node.props.title
		})
		setcurrentcode({ code: code.split("--")[1] });
		getdocument({ code: code.split("--")[1] });
	}
}
