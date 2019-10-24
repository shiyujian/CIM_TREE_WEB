import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import {
    getCompanyDataByOrgCode,
    getUser,
    getUserIsManager
} from '_platform/auth';
const TreeNode = Tree.TreeNode;

export default class DatumTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeData: [],
            loadedKeys: [],
            permission: false
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getOrgTree,
                getChildOrgTreeByID,
                getParentOrgTreeByID
            }
        } = this.props;
        // 管理员和业主可以查看全部，其他人只能查看自己公司
        let permission = getUserIsManager();
        const user = getUser();
        if (!permission) {
            // 获取登录用户的公司的信息
            let orgID = user.org;
            // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
            let parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
            // 如果在公司下，则获取公司所有的信息
            if (parentOrgData && parentOrgData.ID) {
                let parentOrgID = parentOrgData.ID;
                // 获取公司线下的所有部门信息
                let treeData = await getChildOrgTreeByID({id: parentOrgID});
                console.log('treeData------------------', treeData);
                this.setState({
                    treeData: [treeData]
                });
            }
        } else {
            let treeData = await getOrgTree({});
            treeData.map((item) => {
                if (item && item.Orgs && item.Orgs.length > 0) {
                    item.children = item.Orgs || [];
                }
            });
            this.setState({
                treeData
            });
        }
        this.setState({
            permission
        });
    }
    // componentWillReceiveProps = async (nextProps) => {
    //     const {
    //         getDirStatus
    //     } = nextProps;
    //     const {
    //         actions: {
    //             getOrgTree
    //         }
    //     } = this.props;
    //     if (getDirStatus && getDirStatus !== this.props.getDirStatus) {
    //         let treeData = await getOrgTree({});
    //         treeData.map((item) => {
    //             if (item && item.Orgs && item.Orgs.length > 0) {
    //                 item.children = item.Orgs || [];
    //             }
    //         });
    //         console.log('treeData', treeData);
    //         console.log('loadedKeys', this.state.loadedKeys);
    //         this.setState({
    //             // treeData,
    //             loadedKeys: []
    //         });
    //     }
    // }
    loop (data = [], companyStatus = false) {
        return data.map(item => {
            if (item.OrgType) {
                if (item.OrgType.indexOf('单位') !== -1) {
                    companyStatus = true;
                } else if (item.OrgType === '非公司') {
                    companyStatus = false;
                }
            }
            if (item && item.OrgPK) {
                companyStatus = true;
            }
            if (item && item.Orgs && item.Orgs.length > 0) {
                item.children = item.Orgs || [];
            }
            if (!item.children) {
                item.children = [];
            }
            let disabled = true;
            if (item.DirName || item.Orgs) {
                disabled = false;
            }
            if (item.children && item.children.length > 0) {
                if (item.children[0].DirName) {
                    companyStatus = false;
                }
                return (
                    <TreeNode
                        key={item.ID}
                        disabled={disabled}
                        // {...item}
                        dataRef={item}
                        title={`${item.DirName || item.OrgName || item.ProjectName}`}
                    >
                        {
                            !companyStatus
                                ? this.loop(item.children, companyStatus)
                                : []
                        }
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.ID}
                    {...item}
                    disabled={disabled}
                    dataRef={item}
                    title={`${item.DirName || item.OrgName || item.ProjectName}`}
                />
            );
        });
    }
    onLoadData = (treeNode) => {
        const {
            actions: {
                getDirTree
            }
        } = this.props;
        const {
            treeData,
            loadedKeys
        } = this.state;
        if (treeNode.props.children && treeNode.props.children.length > 0) {
            return new Promise(resolve => {
                if (treeNode.props.children) {
                    loadedKeys.push(treeNode.props.eventKey);
                    this.setState({
                        loadedKeys
                    });
                    resolve();
                }
            });
        } else {
            this.setState({ loading: true });
            let postData = {
                dirtype: '前期资料',
                orgid: treeNode.props.eventKey
            };
            return getDirTree({}, postData).then((dirData) => {
                treeNode.props.dataRef.children = dirData;
                this.getNewTreeData(treeData, treeNode.props.eventKey, dirData);
                loadedKeys.push(treeNode.props.eventKey);
                this.setState({
                    loading: false,
                    treeData: [...this.state.treeData],
                    loadedKeys
                });
            });
        }
    }

    getNewTreeData (treeData, curKey, child) {
        const loopData = (data) => {
            data.forEach((item) => {
                if (curKey.indexOf(item.ID) === 0) {
                    item.children = child;
                } else {
                    if (item.children) {
                        loopData(item.children);
                    }
                }
            });
        };
        loopData(treeData);
    }

    render () {
        const {
            selectedKeys
        } = this.props;
        const {
            loading = false,
            treeData = []
        } = this.state;
        console.log('this.props.selectedKeys', this.props.selectedKeys);
        return (
            <Spin tip='加载中' spinning={loading}>
                <div>
                    {treeData.length ? (
                        <Tree
                            loadData={this.onLoadData.bind(this)}
                            selectedKeys={[selectedKeys]}
                            onSelect={this.props.onSelect}
                        >
                            {this.loop(treeData)}
                        </Tree>
                    ) : (
                        ''
                    )}
                </div>
            </Spin>
        );
    }
}
