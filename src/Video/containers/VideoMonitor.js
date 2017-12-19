/**
 * Created by tinybear on 17/8/8.
 */

import React,{Component} from 'react';
import {Tree,Row,Col} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store';
import Camera from '../components/Camera';
import './VideoMonitor.less';
const {TreeNode} = Tree;


@connect(
    state => {
        const {video} = state;
        return {video};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...actions}, dispatch),
    }),
)
class VideoMonitor extends Component{

    constructor(props){
        super(props);
        this.state={
            bodyHeight:'',
            treeData:[]
        }
    }

    componentDidMount(){
        let bodyHeight = document.querySelector('html').clientHeight - 80 - 36 - 52;
        this.setState({bodyHeight});
        // let {getVideo} = this.props.actions;
        // getVideo();
        this.initCameraTree();
    }

    initCameraTree = () => {
        const { getCameraTree } = this.props.actions
        getCameraTree().then(res => {
            // const tmp = res.children
            // const treeData = tmp[0].children.map(project => {
                const treeData = res.children.map(project => {
                const engineerings = project.children
                return engineerings ? {
                    title: project.name,
                    key: project.pk,
                    children: engineerings.map(engineering => {
                        const cameras = engineering.extra_params.cameras
                        return cameras ? {
                            title: engineering.name,
                            key: engineering.pk,
                            children: cameras ? cameras.map(camera => {
                                return {
                                    title: camera.name,
                                    key: camera.pk,
                                    extra: camera
                                }
                            }) : []
                        } : {
                            title: engineering.name,
                            key: engineering.pk,
                        }
                    })
                } : {
                    title: project.name,
                    key: project.pk,
                }
            })
            this.setState({treeData: treeData})
        })
    }

    renderTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key = {item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode {...item} dataRef={item} />
        })
    }

    selectCamera=(keys)=>{
        let key =  keys.length ? keys[0]:'';
        /* const {videos} = this.props.video;
        let selectedCamera = null;
        videos.forEach(v=>{
            selectedCamera = v.children.find(v1=>v1.pk == key);
        });
        selectedCamera && this.refs.camera.loadCamera(selectedCamera); */
        const {treeData} = this.state;
        let selectedCamera = null;
        treeData.forEach(v=>{
            v.children.forEach((vv)=>{
                if(!selectedCamera && vv.children)
                    selectedCamera = vv.children.find(v1=>v1.key == key);
            })
        });
        console.log(selectedCamera,'selectedCamera',key);
        selectedCamera && this.refs.camera.loadCamera(selectedCamera);
    }

    render(){
        const {videos} = this.props.video;
        const {bodyHeight,treeData} = this.state;
        return (<div style={{height:bodyHeight+'px'}}  className="video-con">
                <div className="camera-tree" style={{height:(bodyHeight-150)+'px'}}>
                {
                    treeData?
                    <Tree showLine defaultExpandAll={true} onSelect={this.selectCamera}>
                        {
                            /* videos && videos.map(v=>{
                                return (<TreeNode title={v.name} key={v.pk}>
                                    {
                                        v.children.map(v1=>{
                                            return <TreeNode title={v1.name} key={v1.pk}></TreeNode>
                                        })
                                    }
                                </TreeNode>)
                            }) */
                            this.renderTreeNodes(treeData)
                        }
                    </Tree>:''
                }
                </div>
                <div className="camera-panel">
                    <Camera {...this.props} ref="camera" ></Camera>
                </div>
        </div>)
    }
}

export default VideoMonitor;
