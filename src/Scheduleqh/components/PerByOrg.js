/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
*
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';
import { Tabs,Tree,Spin,TreeSelect,Select} from 'antd';
import moment from 'moment';
import {actions as platformActions} from '_platform/store/global';
import {actions as perActions} from '../store/per';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
@connect(
    state => {
        const {platform, per={}} = state;
		return {platform,per};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...perActions}, dispatch)
    })
)

export default class PerByOrg extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            select:false,
            value: '',
            treeData: null
        }
        this.treeNodes=[];
        this.treeData=[];
        this.member=[];
    }


    componentWillReceiveProps(nextProps){
        if(this.props.rootTreeNodes != nextProps.rootTreeNodes){
            let{
                rootTreeNodes
            }=nextProps
            this.member=[];
            Promise.all(this.createOrgMemberTree(rootTreeNodes)).then(values =>{
                rootTreeNodes = this.createSelectTree(rootTreeNodes)
    
                this.setState({
                    treeData: rootTreeNodes
                });
            })
            
        }
    }
    render() {
        const { rootTreeNodes = [] } = this.props;

        const {
            treeData
        } = this.state;
        
        return( 
                <Select size={'small'} style={{ width: '100%' }}
                placeholder="请选择执行人"
                onChange={this.onChange.bind(this)}
                >
                    {
                        this.member.map(r=>{
                            return <Option value={r.value} key={r.pk} >{r.name}</Option>
                        })
                    }
                </Select>
                // <TreeSelect
                //     style={{ width: '100%' }}
                //     value={this.state.value}
                //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                //     treeData={treeData}
                //     placeholder="请选择执行人"
                //     treeDefaultExpandAll
                //     onChange={this.onChange}
                //     treeCheckable={true}
                //     allowClear={true}
                // />
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

    // onChange = (value) => {
    //     let index = this.props.index
    //     this.setState({ value });
    //     this.props.selectMember(value,index)

    // }
    onChange = (value) => {
        let index = this.props.index
        this.props.selectMember(value,index)
    }

    createOrgMemberTree = (rootTree) => {

        return rootTree.map((orgNode,index) => {
            return this.recursiveTree(orgNode)
                .then(finalNode => rootTree[index] = finalNode);
        });

    }

    getOrgDetailInfo = (pk) => {
        const {actions: {getORGTree}} = this.props;    

        const data = {
            pk
        };
        console.log('this.props',this.props)
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
                        children:payload.children
                    }

            }
            return tree
        });

    }

    getMembersByOrgCode = (code) => {
        const {
            actions: {
                getORGMember
            }} = this.props;
        let system = JSON.parse(window.localStorage.getItem('USER_DATA'));

        const data = {
            org_code : code
        };
        return getORGMember({},data).then( (payload) => {
            const tree = [];
            if(payload){
                for(var i=0;i<payload.length;i++){
                    console.log('payload',payload)
                    tree.push({
                        pk:payload[i].id,
                        code:payload[i].account.person_code,
                        name:payload[i].account.person_name,
                        username:payload[i].username,
                        type:payload[i].account.person_type,
                        label:payload[i].account.person_name,
                        value:payload[i].account.person_code,
                        key:payload[i].id
                    })
                    this.member.push({
                        pk:payload[i].id,
                        code:payload[i].account.person_code,
                        name:payload[i].account.person_name,
                        username:payload[i].username,
                        type:payload[i].account.person_type,
                        label:payload[i].account.person_name,
                        value:payload[i].account.person_type+'#'+payload[i].account.person_code+'#'+payload[i].account.person_name+'#'+payload[i].id+'#'+payload[i].username,
                        key:payload[i].id
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
            children:currentNode.children
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
