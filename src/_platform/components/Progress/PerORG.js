/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
*
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';
import { Tabs,Tree,Spin,TreeSelect} from 'antd';
import style from './index.css';
const TabPane = Tabs.TabPane;
import moment from 'moment';
import * as actions from '../store/institution';
const TreeNode = Tree.TreeNode;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


@connect(
    state => {
        const {institution = {}} = state.incompleteTask|| {};
        return {
            ORGMember:institution.ORGMember,

        };
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        dispatch
    })
)


export default class PerORG extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            select:false,
            value: '',
            treeData: null,
        }
        this.treeNodes=[];
        this.treeData=[];
    }


    componentDidMount(){
        let { rootTreeNodes = [] } = this.props;
        // let rootTreeData = rootTreeNodes
        Promise.all(this.createOrgMemberTree(rootTreeNodes)).then(values =>{
            rootTreeNodes = this.createSelectTree(rootTreeNodes)

            this.setState({
                treeData: rootTreeNodes
            });
        })
        // this.createOrgMemberTree(rootTreeNodes)
        // this.createSelectTree(rootTreeNodes)
    }
    render() {
        const { rootTreeNodes = [] } = this.props;

        const {
            treeData
        } = this.state;

        console.log('treeData',treeData)
        return(
                <TreeSelect
                    style={{ width: '100%' }}
                    value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    placeholder="请选择执行人"
                    treeDefaultExpandAll
                    onChange={this.onChange}
                    treeCheckable={true}
                    allowClear={true}
                />
        )
    }

    createSelectTree(rootTreeNodes) {
        for(var i=0;i<rootTreeNodes.length;i++){
            if(rootTreeNodes[i].children){
                rootTreeNodes[i].type = rootTreeNodes[i].obj_type;
                rootTreeNodes[i].label = rootTreeNodes[i].name;
                rootTreeNodes[i].value = rootTreeNodes[i].obj_type+'#'+rootTreeNodes[i].code+'#'+rootTreeNodes[i].name+'#'+rootTreeNodes[i].pk;
                rootTreeNodes[i].key = rootTreeNodes[i].pk;
                rootTreeNodes[i].children = this.createSelectTree(rootTreeNodes[i].children)
            }else{
                rootTreeNodes[i].label = rootTreeNodes[i].name;
                rootTreeNodes[i].value = rootTreeNodes[i].type+'#'+rootTreeNodes[i].code+'#'+rootTreeNodes[i].name+'#'+rootTreeNodes[i].pk+'#'+rootTreeNodes[i].username;
                rootTreeNodes[i].key = rootTreeNodes[i].pk;
            }
        }
        return rootTreeNodes;
    }

    onChange = (value) => {
        let index = this.props.index
        this.setState({ value });
        this.props.selectMember(value,index)

    }

    createOrgMemberTree = (rootTree) => {

        return rootTree.map((orgNode,index) => {
            return this.recursiveTree(orgNode)
                .then(finalNode => rootTree[index] = finalNode);
        });

    }

    getOrgDetailInfo = (pk) => {
        const {
            actions: {
                getORGTree,
            }} = this.props;
        let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
        let Workflow_API = '';
        const System_API = API_CONFIG.Workflow_API;
        for(var i=0;i<System_API.length;i++){
            if(system.system === System_API[i].name){
                Workflow_API = System_API[i].value;
            }
        }


        const data = {
            Workflow_API: Workflow_API,
            pk,
        };

        // return getORGTree(data)
        return getORGTree(data).then( (payload) => {
            let  tree = '';
            if(payload){
                    tree={
                        pk:payload.pk,
                        code:payload.code,
                        name:payload.name,
                        type:payload.obj_type,
                        label:payload.name,
                        value:payload.code,
                        key:payload.pk,
                        children:payload.children,
                    }

            }
            return tree
        });

    }

    getMembersByOrgCode = (code) => {
        const {
            actions: {
                setCurrentTreeNodes,
                getORGMember,
            }} = this.props;
        let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
        let Workflow_API = '';
        const System_API = API_CONFIG.Workflow_API;
        for(var i=0;i<System_API.length;i++){
            if(system.system === System_API[i].name){
                Workflow_API = System_API[i].value;
            }
        }

        const api = {
            Workflow_API: Workflow_API,
        };

        const data = {
            org_code : code,
        };
        return getORGMember(api,data).then( (payload) => {
            const tree = [];
            if(payload){
                for(var i=0;i<payload.length;i++){
                    tree.push({
                        pk:payload[i].id,
                        code:payload[i].account.person_code,
                        name:payload[i].account.person_name,
                        username:payload[i].username,
                        type:payload[i].account.person_type,
                        label:payload[i].account.person_name,
                        value:payload[i].account.person_code,
                        key:payload[i].id,
                    })
                }
            }
            return tree;
        });
    }


    recursiveTree = (currentNode, fatherNode=null, indexOfCurrNodeInFather=-1) => {

        // get currentNode detail info
        return this.getOrgDetailInfo(currentNode.pk).then(rsp => {
            currentNode = rsp;

            const index  = indexOfCurrNodeInFather;
            if(currentNode.children.length > 0) {

                const childrenUpdata = currentNode.children.map((node, indexOfNode) => {
                    return this.recursiveChildren(node, currentNode, indexOfNode);
                })

                return Promise.all(childrenUpdata).then(result => currentNode);
            } else {
                // find members
                return this.getMembersByOrgCode(currentNode.code).then(memberArray => {
                    currentNode.children.push(...memberArray);
                    return currentNode;
                });

            }
            if(fatherNode && index!==-1) {
                fatherNode.children[index] = currentNode;
            }
            return currentNode;

        });

    }

    recursiveChildren = (currentNode, fatherNode=null, indexOfCurrNodeInFather=-1) => {

        currentNode={
            pk:currentNode.pk,
            code:currentNode.code,
            name:currentNode.name,
            type:currentNode.obj_type,
            label:currentNode.name,
            value:currentNode.code,
            key:currentNode.pk,
            children:currentNode.children,
        }

        const index  = indexOfCurrNodeInFather;
        if(currentNode.children.length > 0) {

            const childrenUpdata = currentNode.children.map((node, indexOfNode) => {
                return this.recursiveChildren(node, currentNode, indexOfNode);
            })

            return Promise.all(childrenUpdata).then(result => currentNode);
        } else {
            // find members
            return this.getMembersByOrgCode(currentNode.code).then(memberArray => {
                currentNode.children.push(...memberArray);
                return currentNode;
            });

        }
        if(fatherNode && index!==-1) {
            fatherNode.children[index] = currentNode;
        }
        return currentNode;
    }



}
