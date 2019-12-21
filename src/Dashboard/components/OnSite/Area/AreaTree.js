import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import {PROJECTPOSITIONCENTER} from '_platform/api';
import {
    getDefaultProject
} from '_platform/auth';
import './AreaTree.less';
const TreeNode = Tree.TreeNode;
export default class AreaTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            projectNameSelect: '',
            treeDataSelect: []
        };
    }
    loop (data = [], loopTime) {
        const that = this;
        let disableCheckbox = true;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 2) {
            disableCheckbox = false;
        }
        if (data) {
            return (
                <TreeNode
                    title={data.Name}
                    key={data.No}
                    disabled={!disableCheckbox}
                    selectable={disableCheckbox}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }
    componentDidMount = async () => {
        const {
            map,
            treeData
        } = this.props;
        if (document.querySelector('#AreaTreeAsideDom')) {
            let AreaTreeAsideDom = Scrollbar.init(document.querySelector('#AreaTreeAsideDom'));
            console.log('AreaTreeAsideDom', AreaTreeAsideDom);
        }
        let defaultProject = await getDefaultProject();
        let treeDataSelect = [];
        let projectNameSelect = '';
        treeData.map((child) => {
            if (child.No === defaultProject) {
                treeDataSelect = child.children;
                projectNameSelect = child.Name;
            }
        });
        this.setState({
            projectNameSelect,
            treeDataSelect
        });
        if (map) {
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
    }

    handleProjectChange = (project) => {
        const {
            map,
            treeData
        } = this.props;
        try {
            PROJECTPOSITIONCENTER.map(async (option) => {
                if (option.Name === project.Name) {
                    await map.panTo(option.center);
                    // 因先设置直接跳转,然后直接修改放大层级，无法展示，只能在跳转坐标之后，设置时间再重新修改放大层级
                    setTimeout(async () => {
                        await map.setZoom(option.Zoom);
                    }, 500);
                }
            });
            let treeDataSelect = [];
            treeData.map((child) => {
                if (child.No === project.No) {
                    treeDataSelect = child.children;
                }
            });
            this.setState({
                projectNameSelect: project.Name,
                treeDataSelect
            });
        } catch (e) {
            console.log('handleProjectChange', e);
        };
    }

    render () {
        const {
            treeData = [],
            areaTreeLoading
        } = this.props;
        const {
            treeDataSelect,
            projectNameSelect
        } = this.state;
        return (
            <div className='AreaTreePage-container'>
                <div className='AreaTreePage-r-main'>
                    <div className={`AreaTreePage-menuPanel`}>
                        <div className='AreaTreePage-menuBackground' />
                        <aside className='AreaTreePage-aside' id='AreaTreeAsideDom'>
                            <div className='AreaTreePage-aside-Project'>
                                {
                                    treeData.map(project => {
                                        return <a key={project.No}
                                            title={project.Name}
                                            onClick={this.handleProjectChange.bind(this, project)}
                                            className={projectNameSelect === project.Name
                                                ? 'AreaTreePage-aside-Project-textSel'
                                                : 'AreaTreePage-aside-Project-text'}>
                                            {project.Name}
                                        </a>;
                                    })
                                }

                            </div>
                            <div className='AreaTreePage-aside-areaTree'>
                                <Spin spinning={areaTreeLoading}>
                                    <Tree
                                        onSelect={this.props.onSelect}
                                    >
                                        {treeDataSelect.map(p => {
                                            return this.loop(p);
                                        })}
                                    </Tree>
                                </Spin>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>

        );
    }
}
