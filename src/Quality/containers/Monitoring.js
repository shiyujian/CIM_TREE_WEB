import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions, ID} from '../store/item'
import {actions as platformActions} from '_platform/store/global'
import {message} from 'antd'
import {Main, DynamicTitle} from '_platform/components/layout'
import {ProjectTree, CameraMap} from '../components/Monitoring'
import {Sidebar, Content} from '../components'

@connect(
	state => {
		const {item = {}} = state.quality || {}
		return item
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Monitoring extends Component {

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
