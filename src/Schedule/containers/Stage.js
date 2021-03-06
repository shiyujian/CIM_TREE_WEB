import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Schedule.less';
import { PkCodeTree } from '../components/Stage';
import { Actual } from '../components/Stage/DayActual';
import { WeekPlan } from '../components/Stage/WeekPlan';
import { Spin, Tabs } from 'antd';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../store/stage';
import { getUser } from '_platform/auth';
const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {
            schedule: { stage = {} },
            platform
        } = state;
        return { platform, ...stage };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...previewActions, ...actions },
            dispatch
        )
    })
)
export default class Stage extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            auditorList: [], // 审核人列表
            treetyoption: [],
            treeLists: [],
            leftkeycode: '',
            loading: true
        };
    }

    async componentDidMount () {
        const {
            actions: {
                getTreeNodeList
            },
            platform: { tree = {} }
        } = this.props;

        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            let data = await getTreeNodeList();
            if (data && data instanceof Array && data.length > 0) {
                this.setState({
                    loading: false
                });
            }
        } else {
            this.setState({
                loading: false
            });
        }
        this.getAuditor();
        let user = getUser();
        let section = user.section;
        if (section) {
            let code = section.split('-');
            if (code && code.length === 3) {
                this.setState({
                    leftkeycode: code[0]
                });
            }
        }
    }

    getAuditor = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let user = await getUser();
        if (!(user && user.section)) {
            return;
        }
        let roles = await getRoles();
        let postRoleData = ''; // 监理文书ID
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '监理文书') {
                postRoleData = role.ID;
            }
        });
        let postdata = {
            role: postRoleData,
            section: user.section,
            status: 1,
            page: '',
            size: ''
        };
        getUsers({}, postdata).then(rep => {
            if (rep.code === 200) {
                let auditorList = [];
                rep.content.map(item => {
                    auditorList.push({
                        Full_Name: item.Full_Name,
                        User_Name: item.User_Name,
                        id: item.ID
                    });
                });
                this.setState({
                    auditorList
                });
            }
        });
    }
    render () {
        const { leftkeycode, loading } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <div>
                <DynamicTitle title='进度填报' {...this.props} />
                {
                    loading
                        ? <Spin spinning={loading} tip='Loading...' />
                        : <div>
                            <Sidebar>
                                <div
                                    style={{ overflow: 'hidden' }}
                                    className='project-tree'
                                >
                                    <PkCodeTree
                                        treeData={treeList}
                                        selectedKeys={leftkeycode}
                                        onSelect={this.onSelect.bind(this)}
                                    // onExpand={this.onExpand.bind(this)}
                                    />
                                </div>
                            </Sidebar>
                            <Content>
                                <div>
                                    <Tabs defaultActiveKey='2'>
                                        <TabPane tab='每周计划进度' key='2'>
                                            <WeekPlan {...this.props} {...this.state} />
                                        </TabPane>
                                        <TabPane tab='每日实际进度' key='3'>
                                            <Actual
                                                {...this.props}
                                                {...this.state}
                                            />
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Content>
                        </div>
                }

            </div>
        );
    }

    // 树选择
    onSelect (value = []) {
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode });
    }
}
