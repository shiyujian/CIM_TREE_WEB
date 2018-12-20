import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';
import * as actions from '../store/entry';
import { PkCodeTree } from '../components';
import { ScheduleTable } from '../components/ScheduleAnalyze';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import LeftTop from '../components/ScheduleAnalyze/LeftTop';
import BottomLeft from '../components/ScheduleAnalyze/BottomLeft';
import RightTop from '../components/ScheduleAnalyze/RightTop';
import BottomRight from '../components/ScheduleAnalyze/BottomRight';
import {
    getAreaTreeData,
    getDefaultProject
} from '_platform/auth';

@connect(
    state => {
        const { platform } = state || {};
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class ScheduleAnalyze extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
            sectionsData: []
        };
    }

    async componentDidMount () {
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
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys, info) {
        const {
            platform: { tree = {} }
        } = this.props;
        try {
            let treeList = tree.thinClassTree;
            let keycode = keys[0] || '';
            const {
                actions: { setkeycode }
            } = this.props;
            let sectionsData = [];
            if (keycode) {
                treeList.map((treeData) => {
                    if (keycode === treeData.No) {
                        sectionsData = treeData.children;
                    }
                });
                setkeycode(keycode);
                this.setState({
                    leftkeycode: keycode,
                    sectionsData
                });
            }
        } catch (e) {
            console.log('onSelect', e);
        }
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
                    <DynamicTitle title='种植进度分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <ScheduleTable {...this.props} {...this.state} />
                        <Row style={{ margin: '10px 5px' }}>
                            <Col span={12}>
                                <LeftTop {...this.props} {...this.state} />
                            </Col>
                            <Col span={12}>
                                <RightTop {...this.props} {...this.state} />
                            </Col>
                        </Row>
                        <Row style={{ margin: '10px 5px' }}>
                            <Col span={12}>
                                <BottomLeft {...this.props} {...this.state} />
                            </Col>
                            <Col span={12}>
                                <BottomRight {...this.props} {...this.state} />
                            </Col>
                        </Row>
                    </Content>
                </Main>
            </Body>
        );
    }
}
