import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/educationRegisters';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Filter, Table, Addition, Updatemodal, DatumTree } from '../components/EducationRegisters'
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
export const Datumcode = window.DeathCode.SAFETY_AQJY;

// @connect(
// 	state => {
// 		const {educationRegisters = {}, platform} = state || {};
// 		return {...educationRegisters, platform};
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
// 	})
// )
@connect(
	state => {
		const { safety: { educationRegisters = {} }, platform } = state;
		return { ...educationRegisters, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions,...previewActions }, dispatch),
	}),
)


export default class EducationRegisters extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isTreeSelected: false,
			loading: false
		}
	}

	render() {
		const {
            platform: {
                dir: {
                    list = []
                } = {}
            } = {},
			keycode
        } = this.props;
		return (
			<Body>
				<Main>
					<DynamicTitle title="安全教育1" {...this.props} />
					<Sidebar>
						<DatumTree treeData={list}
							selectedKeys={keycode}
							onSelect={this.onSelect.bind(this)}
							{...this.state} />
					</Sidebar>
					<Content>
						<Filter  {...this.props} {...this.state} />
						<Table {...this.props} />
					</Content>
					<Addition {...this.props} />
				</Main>
				<Updatemodal {...this.props} />
				<Preview />
			</Body>
		);
	}

	componentDidMount() {
		const { actions: { getDir } } = this.props;
		this.setState({ loading: true });
		getDir({ code: Datumcode }).then(({ children }) => {
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
		this.setState({ isTreeSelected: e.selected })
		setcurrentcode({ code: code.split("--")[1] });
		getdocument({ code: code.split("--")[1] });
	}
}
