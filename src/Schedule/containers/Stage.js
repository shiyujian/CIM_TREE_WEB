import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Schedule.less';
import { Actual, Total, WeekPlan } from '../components/Stage';
import { PkCodeTree } from '../components';
import { Spin, Tabs } from 'antd';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../store/stage';
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
        console.log('tree', tree);
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
                                    <Tabs>
                                        <TabPane tab='总计划进度' key='1'>
                                            <Total {...this.props} {...this.state} />
                                        </TabPane>
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
