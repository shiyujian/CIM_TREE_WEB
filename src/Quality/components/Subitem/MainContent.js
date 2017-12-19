/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/subitem';
import {getUser} from '_platform/auth'
import {SubitemTable} from './SubitemTable';
import SheetPage from './SheetPage';
import {SubitemTable2} from './SubitemTable2';
import SheetPage2 from './SheetPage2';
import {Button, Tree} from 'antd';
import {Sidebar} from './Sidebar'

const TreeNode = Tree.TreeNode;

@connect(
	state => {
		const {subitem = {}} = state.quality || {};
		return subitem;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export default class MainContent extends Component{
    constructor(props) {
    	super(props);
    	this.state = {
            page: 0,
            initialData: null,
            treeData: [],
            ptrData: [],
            accountType: 0,
            targetDanwei:null
        };
    }

    componentDidMount() {
        const userData = getUser()
        const { fetchUserDetail, fetchRootOrg } = this.props.actions
        fetchUserDetail({pk: userData.id}).then(user_res => {
            fetchRootOrg({code: user_res.account.org_code}).then(org_res => {
                let accountType = 0
                try {
                    const orgName = org_res.children[0].name
                    accountType = orgName === '施工单位' ? 1 : orgName === '监理单位' ? 2 : 0
                } catch (e) {
                    console.log('error: ',e)
                }
                this.setState({accountType})
            })
        })
        this.initProjectTree()
    }

    render() {
        const {page, initialData, ptrData, accountType} = this.state
        return page === 0
            ? accountType === 1 ? this.getMainPage(ptrData) : this.getMainPage2(ptrData)
            : accountType === 1 ? this.getSheetPage(initialData) : this.getSheetPage2(initialData)
    }

    getMainPage = (ptrData) => {
        return (
            <div>
				<Sidebar>
                    {
                        this.state.treeData.length ?
                        <Tree onSelect={this.handleSelectTreeNode} className='global-tree-list' showLine defaultExpandAll={true}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> : ''
                    }
                </Sidebar>
                <div style={{float: 'right', width: 'calc(100% - 220px)', padding: 20}}>
                    <SubitemTable ptrData={ptrData} setPage={this.setPage}></SubitemTable>
                </div>
            </div>
        )
    }

    getSheetPage = (initialData) => {
        return (
            <div style={{textAlign: 'center', padding: 20}}>
                <div style={{display: 'inline-block', textAlign: 'center', position: 'relative'}}>
                    <Button
                        style={{position: 'absolute',  left: '-92px'}}
                        type="primary"
                        icon="rollback"
                        onClick={() => {this.setPage(0, null)}}
                    >
                        返回
                    </Button>
                    <SheetPage initialData={initialData} setPage={this.setPage} targetDanwei={this.state.targetDanwei}/>
                    {/* <Button
                        style={{float: 'right', position: 'absolute',  marginLeft: 18}}
                        type="primary"
                        icon="printer"
                    >
                        打印
                    </Button> */}
                </div>
            </div>
        )
    }

    getMainPage2 = (ptrData) => {
        return (
            <div>
				<Sidebar>
                    {
                        this.state.treeData.length ?
                        <Tree onSelect={this.handleSelectTreeNode} className='global-tree-list' showLine defaultExpandAll={true}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> : ''
                    }
                </Sidebar>
                <div style={{float: 'right', width: 'calc(100% - 220px)', padding: 20}}>
                    <SubitemTable2 ptrData={ptrData} setPage={this.setPage}></SubitemTable2>
                </div>
            </div>
        )
    }

    getSheetPage2 = (initialData) => {
        return (
            <div style={{textAlign: 'center', padding: 20}}>
                <div style={{display: 'inline-block', textAlign: 'center', position: 'relative'}}>
                    <Button
                        style={{position: 'absolute',  left: '-92px'}}
                        type="primary"
                        icon="rollback"
                        onClick={() => {this.setPage(0, null)}}
                    >
                        返回
                    </Button>
                    <SheetPage2 initialData={initialData} setPage={this.setPage}/>
                    {/* <Button
                        style={{float: 'right', position: 'absolute',  marginLeft: 18}}
                        type="primary"
                        icon="printer"
                    >
                        打印
                    </Button> */}
                </div>
            </div>
        )
    }

    initProjectTree = async () => {
        const { getProjectTree } = this.props.actions
        const prj_res = await getProjectTree()
        // const tmp = res.children
        // const treeData = tmp[0].children.map(project => {
        const getChilds = (item) => {
            if (item.children && item.children.length) {
                return item.children.map(x => {
                    return {
                        title: x.name,
                        name: x.name,
                        key: x.pk,
                        pk: x.pk,
                        code: x.code,
                        obj_type: x.obj_type,
                        children: getChilds(x)
                    }
                })
            } else {
                return item.children.map(x => {
                    return {
                        title: x.name,
                        name: x.name,
                        key: x.pk,
                        pk: x.pk,
                        code: x.code,
                        obj_type: x.obj_type,
                    }
                })
            }
        }
        const data = getChilds(prj_res)
        // const treeData = prj_res.children.map(project => {
        //     const engineerings = project.children
        //     return engineerings ? {
        //         title: project.name,
        //         key: project.pk,
        //         pk: project.pk,
        //         code: project.code,
        //         obj_type: project.obj_type,
        //         children: engineerings.map(engineering => {
        //             const subEngineerings = engineering.children
        //             return subEngineerings ? {
        //                 title: engineering.name,
        //                 key: engineering.pk,
        //                 pk: engineering.pk,
        //                 code: engineering.code,
        //                 obj_type: engineering.obj_type,
        //                 children: subEngineerings ? subEngineerings.map(subEngineering => {
        //                     return {
        //                         title: subEngineering.name,
        //                         name: subEngineering.name,
        //                         key: subEngineering.pk,
        //                         pk: subEngineering.pk,
        //                         code: subEngineering.code,
        //                         obj_type: subEngineering.obj_type,
        //                         // extra: subEngineering
        //                     }
        //                 }) : []
        //             } : {
        //                 title: engineering.name,
        //                 key: engineering.pk,
        //                 pk: engineering.pk,
        //                 obj_type: engineering.obj_type,
        //             }
        //         })
        //     } : {
        //         title: project.name,
        //         key: project.pk,
        //         pk: project.pk,
        //         obj_type: project.obj_type,
        //     }
        // })
        this.setState({treeData: data})
    }

    renderTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                const childs = item.children
                return (
                    <TreeNode title={item.title} key = {item.key} dataRef={item}>
                        {childs.length && childs[0].obj_type !== 'C_WP_PTR' ? this.renderTreeNodes(childs) : null}
                    </TreeNode>
                )
            }
            return <TreeNode {...item} dataRef={item} />
        })
    }

    handleSelectTreeNode = async(selectedKeys, e) => {
        const nodeProps = e.node.props
		// const indexArr = nodeProps.pos.split('-')
        const nodedata = nodeProps.dataRef
        const {getWorkpackagesDetail} = this.props.actions
        let targetDanwei = await getWorkpackagesDetail({pk: nodedata.key});
        let ptrData = []
        switch (nodedata.obj_type) {
            case 'C_WP_UNT':
            //单位工程
                const childs = nodedata.children
                if (childs.length === 0) {
                    ptrData = []
                    this.setState({ptrData,targetDanwei})
                    return
                }
                if (childs && childs.length && childs[0].obj_type === 'C_WP_PTR') {
                    //分部
                    ptrData = childs
                    this.setState({ptrData,targetDanwei})
                    return
                } else {
                    //子单位工程
                    const promiseArr = childs ? childs.map(item => { return getWorkpackagesDetail({pk: item.key}) }) : []
                    if (promiseArr.length) {
                        Promise.all(promiseArr).then(res => {
                            res.map(x => x.children_wp.map(y => ptrData.push(y)))
                            this.setState({ptrData,targetDanwei})
                            return
                        })
                    }
                }
                break;
            case 'C_WP_UNT_S':
            //子单位工程
                getWorkpackagesDetail({pk: nodedata.key}).then(res => {
                    ptrData = res.children_wp
                    this.setState({ptrData,targetDanwei})
                })
                break;
            default:
                this.setState({ptrData})
        }
    }

    setPage = (page, initialData) => {
        this.setState({ page, initialData })
    }
}
