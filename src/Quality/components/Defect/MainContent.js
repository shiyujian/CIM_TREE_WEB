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
import {actions} from '../../store/defect';
import {DefectTable} from './DefectTable';
import {DefectMap} from './DefectMap';
import {SheetPage} from './SheetPage';
import {Row, Col, Button, Tree} from 'antd';
import {Sidebar} from '../../components'
var $ = require('jquery')
const TreeNode = Tree.TreeNode;

@connect(
	state => {
		const {defect = {}} = state.quality || {};
		return defect;
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
            sheetType: 0,
            treeData: [],
            ptrData: []
        };
    }

    componentDidMount() {
        this.initProjectTree()
    }

    render() {
        const {page, initialData, sheetType, ptrData} = this.state
        return page === 0 ? this.getMainPage(ptrData) : this.getSheetPage(initialData, sheetType)
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
                <Row gutter={8} style={{float: 'right', width: 'calc(100% - 220px)', padding: 20}}>
                    <Col span={15}>
                        <DefectTable ptrData={ptrData} setPage={this.setPage}></DefectTable>
                    </Col>
                    <Col span={9}>
                        <DefectMap></DefectMap>
                    </Col>
                </Row>
            </div>
        )
    }

    getSheetPage = (initialData, sheetType) => {
        return (
            <div style={{textAlign: 'center', padding: 20}}>
                <div style={{display: 'inline-block', textAlign: 'center', position: 'relative'}}>
                    <Button
                        style={{position: 'absolute',  left: '-92px'}}
                        type="primary"
                        icon="rollback"
                        onClick={() => {this.setPage(0, null, 0)}}
                    >
                        返回
                    </Button>
                    <SheetPage initialData={initialData} sheetType={sheetType}/>
                    <Button
                        style={{float: 'right', position: 'absolute',  marginLeft: 18}}
                        type="primary"
                        icon="printer"
                        onClick={() => {$("#explain").jqprint();}}
                    >
                        打印
                    </Button>
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

    handleSelectTreeNode = (selectedKeys, e) => {
        const nodeProps = e.node.props
		// const indexArr = nodeProps.pos.split('-')
        const nodedata = nodeProps.dataRef
        const {getWorkpackagesDetail} = this.props.actions
        let ptrData = []
        switch (nodedata.obj_type) {
            case 'C_WP_UNT':
            //单位工程
                console.log('nodedata',nodedata);
                const childs = nodedata.children
                if (childs.length === 0) {
                    ptrData = []
                    this.setState({ptrData})
                    return
                }
                if (childs && childs.length && childs[0].obj_type === 'C_WP_PTR') {
                    //分部
                    ptrData = childs
                    this.setState({ptrData})
                    return
                } else {
                    //子单位工程
                    const promiseArr = childs ? childs.map(item => { return getWorkpackagesDetail({pk: item.key}) }) : []
                    if (promiseArr.length) {
                        Promise.all(promiseArr).then(res => {
                            res.map(x => x.children_wp.map(y => ptrData.push(y)))
                            this.setState({ptrData})
                            return
                        })
                    }
                }
                break;
            case 'C_WP_UNT_S':
            //子单位工程
                getWorkpackagesDetail({pk: nodedata.key}).then(res => {
                    ptrData = res.children_wp
                    this.setState({ptrData})
                })
                break;
            // case 'C_PJ':
            // //项目或子项目
            // //不做处理
            //     break;
            default:
                this.setState({ptrData})
        }
    }

    setPage = (page, initialData, sheetType) => {
        this.setState({ page, initialData, sheetType })
    }

    handlePrint = (sheetType) => {
        console.log('打印' + sheetType
            ? '质量缺陷整改通知回复单'
            : '质量缺陷整改工作联系单'
        )
    }
}
