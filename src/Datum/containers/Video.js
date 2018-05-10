import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, { actions } from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Filter, Table,Addition,Updatemodal} from '../components/Video'
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
export const Datumcode = window.DeathCode.DATUM_VIDEO;

@connect(
	state => {
		const {datum = {}, platform} = state || {};
		return {...datum, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
	})
)
export default class Video extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isTreeSelected: false,
			loading:false
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
				<DynamicTitle title="视频资料" {...this.props}/>
				<Content>
					<Filter  {...this.props} {...this.state}/>
					<Table {...this.props}/>
				</Content>
				<Addition {...this.props}/>
			</Main>
			<Updatemodal {...this.props} />
			<Preview/>
			</Body>
		);
	}
	
    componentDidMount() {
        const {actions: {getdocument}} = this.props;
        getdocument({code:Datumcode})
    }


}
