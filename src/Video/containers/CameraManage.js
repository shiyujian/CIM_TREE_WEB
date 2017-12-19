import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../store';
import {actions as platformActions} from '_platform/store/global'
import {Main, DynamicTitle} from '_platform/components/layout'
import {Sidebar, Content, ProjectTree, CameraMap} from '../components/CameraManage'

@connect(
	state => {
        const {video} = state;
        return {video};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class CameraManage extends Component {

	static propTypes = {}

	render() {
		return (
			<Main>
				<DynamicTitle title="质量监控" {...this.props}/>
				<Sidebar>
                    <ProjectTree {...this.props}/>
				</Sidebar>
				<Content>
                    <CameraMap {...this.props}/>
				</Content>
			</Main>
		)
	}

}
