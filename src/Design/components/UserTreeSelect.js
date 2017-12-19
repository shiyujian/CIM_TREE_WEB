/**
 * Created by tinybear on 17/9/21.
 * 组织树用户选择组件 带搜索功能
 */

import React,{Component} from 'react';
import {TreeSelect} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as userActions} from '../store/userSelect';
const TreeNode = TreeSelect.TreeNode;

@connect(
    state => {
        return {};
    },
    dispatch => ({
        actions: bindActionCreators({...userActions}, dispatch),
    }),
)
class UserTreeSelect extends Component{

    state={
        value:'',
        users:[],
        treeData:[]
    };

    componentWillReceiveProps(nextProps){
        let oldRootCode = this.props.rootCode;
        let {rootCode,value,valueId} = nextProps;
        if(rootCode && oldRootCode != rootCode){
            this.getUserTreeData(rootCode);
        }
        if(value === ''){
            this.setState({value});
        }
        if(valueId){
            this.setState({value:valueId});
        }
    }

    componentDidMount(){
        let {rootCode,valueId} = this.props;
        if( rootCode ){
            this.getUserTreeData(rootCode);
        }
        if(valueId){
            this.setState({value:valueId});
        }
    }

    reset=()=>{
      this.setState({value:''});
    };

    getLeafs(orgs,leafs){
        let me = this;
        orgs.forEach(o=>{
            leafs.push(o.code);
            me.getLeafs(o.children,leafs);
        });
    }

    parseOrgs(orgs,users,treeData, currentUser){
        let me  = this;
        orgs.forEach(o=>{
            let node ={
                label:o.name,
                key:o.code,
                value:o.code
            };
            treeData.push(node);
            let userNodes = [],relaUsers;
            if(currentUser){
                relaUsers = users.filter(u=>u.account.org_code == o.code && u.id != currentUser.id);                            
            }else{
                relaUsers = users.filter(u=>u.account.org_code == o.code);            
            }
            if(relaUsers && relaUsers.length) {
                userNodes = relaUsers.map(r=>{
                    return {
                        label: r.account.person_name,
                        key: r.account.person_code,
                        value: r.id.toString()
                    }
                });
            }
            if(o.children && o.children.length){
                node.children = [];
                me.parseOrgs(o.children,users,node.children, currentUser);
                node.children = node.children.concat(userNodes);
            }else{
                node.children = userNodes;
            }
        });
    }

    //根据组织code,获取组织树
    getUserTreeData(rootCode){
        let me = this;
        let treeData = [],leafs=[];
        const {getOrgsByCode,getUsers} = this.props.actions;
        const {currentUser} = this.props;
        getOrgsByCode({CODE:rootCode}).then(orgs=>{
            if(orgs.pk && orgs.pk !== 'code') {
                let arrOrgs = [];
                arrOrgs.push(orgs);
                me.getLeafs(arrOrgs,leafs);
                //获取人员数据
                getUsers({},{org_code:leafs.join()}).then(users=>{
                    me.parseOrgs(arrOrgs,users,treeData, currentUser);
                    me.setState({treeData,users});
                });
            }
        })
    }

    onChange=(value)=>{
        let {users} = this.state;
        let {onSelect} = this.props;
        let us = users.find(u=>{
            return u.id == value;
        });
        if(us) {
            this.setState({value});
            onSelect(us);
        }
    };

    genTree(data){
        let me = this;
        return data.map(d=>{
            return <TreeNode title={d.label} value={d.value} key={d.key}>
                {
                    d.children && d.children.length && me.genTree(d.children)
                }
            </TreeNode>
        });
    }

    render(){
        const {treeData} = this.state;
        const {placeholder} = this.props;
        return (<TreeSelect
            style={{ width: 120 }}
            value={this.state.value}
            showSearch
            dropdownStyle={{ maxHeight: 400,minWidth:'200px', overflow: 'auto' }}
            placeholder={placeholder}
            treeDefaultExpandAll
            onChange={this.onChange}
            treeNodeFilterProp="title"
            size="small"
        >
            {
                this.genTree(treeData)
            }
        </TreeSelect>)
    }

}

export default UserTreeSelect;

