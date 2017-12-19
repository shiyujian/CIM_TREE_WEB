import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/user';
import {actions as videoActions} from '../store/video';
import {actions as platformActions} from '_platform/store/global';
import VideoMana from '../components/Video';
import {Tree} from 'antd';
const {TreeNode} = Tree;

@connect(
	state => {
		const {system: {user = {},video={}} = {}, platform} = state;
		return {...user, platform,...video}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...videoActions, ...platformActions}, dispatch)
	})
)
export default class User extends Component {
	static propTypes = {};

	componentDidMount(){
		let {getVideo} = this.props.actions;
		let me = this;
		getVideo().then(()=>{
			const {videos} = me.props;
			if(videos && videos.length)
				me.setState({projectNode:videos[0]});
		});
	}

	state = {
		selectedCamera:null,
		projectNode:null
	}

	render() {
		const {videos} = this.props;
		let firstNodeKey = videos && videos.length ? videos[0].pk:'';
		return (
			<div>
				<DynamicTitle title="视频管理" {...this.props}/>
				<Sidebar>
					<Tree showLine defaultExpandAll={true} defaultSelectedKeys={[firstNodeKey]}
						  onSelect={(keys)=>{
                        let key =  keys.length ? keys[0]:'';
                        const {videos} = this.props;
                        let selectedCamera = null;
                        let projectNode = null;
                        videos.forEach(v=>{
                        	if( v.pk == key)
                        		projectNode = v;
                            selectedCamera = v.children.find(v1=>v1.pk == key);
                        });
                        this.setState({selectedCamera,projectNode});
                        this.refs.videoMana.setAction(selectedCamera);
                    }}>
						{
							videos && videos.map(v=>{
								return (<TreeNode title={v.name} key={v.pk}>
									{
										v.children.map(v1=>{
											return <TreeNode title={v1.name} key={v1.pk}/>
										})
									}
								</TreeNode>)
							})
						}
					</Tree>
				</Sidebar>
				<Content>
					<VideoMana {...this.props} selectedCamera={this.state.selectedCamera}
											   projectNode={this.state.projectNode}
											   ref="videoMana"/>
				</Content>
			</div>
		);
	}
}
