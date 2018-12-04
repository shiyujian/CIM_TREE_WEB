import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select, Row, Col } from 'antd';
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
import RightTop from '../components/ScheduleAnalyze/RightTop';
import MiddleTop from '../components/ScheduleAnalyze/MiddleTop';
import Bottom from '../components/ScheduleAnalyze/Bottom';
import {DEFAULT_PROJECT} from '_platform/api';
const Option = Select.Option;

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
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            leftkeycode: DEFAULT_PROJECT,
            section: '',
            smallclass: '',
            data: [],
            account: '',
            biaoduan: [],
            shuzhi: []
        };
    }

    async componentDidMount () {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }
    // 树选择, 重新获取: 标段、树种并置空
    onSelect (value = []) {
        console.log('onSelect  value', value);
        let keycode = value[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        console.log('ScheduleanalyzeScheduleanalyze', keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
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
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        console.log('tree', tree);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='种植进度分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <ScheduleTable {...this.props} {...this.state} />
                        <Row gutter={10} style={{ margin: '10px 5px' }}>
                            <Col span={8}>
                                <LeftTop {...this.props} {...this.state} />
                            </Col>
                            <Col span={8}>
                                <MiddleTop {...this.props} {...this.state} />
                            </Col>
                            <Col span={8}>
                                <RightTop {...this.props} {...this.state} />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ margin: '10px 5px' }}>
                            <Col span={24}>
                                <Bottom {...this.props} {...this.state} />
                            </Col>
                        </Row>
                    </Content>
                </Main>
            </Body>
        );
    }
}
