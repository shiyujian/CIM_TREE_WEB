import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { CompletionPlanTable, ThinClassTree } from '../components/CompletionPlan';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUser,
    getAreaTreeData,
    getUserIsManager
} from '_platform/auth';

@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class CompletionPlan extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            this.setState({
                loading: true
            });
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                loading: false
            });
        }
    }

    onSelect = async (keys, info) => {
        console.log('keys', keys);
        console.log('info', info);
        this.setState({
            areaEventKey: keys[0]
        });
    }

    render () {
        const {
            leftkeycode
        } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='灌溉竣工图导出' {...this.props} />
                    <Sidebar>
                        <ThinClassTree
                            {...this.state}
                            {...this.props}
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <CompletionPlanTable
                            {...this.props}
                            {...this.state}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
