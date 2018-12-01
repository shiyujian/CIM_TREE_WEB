import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Input, Icon, DatePicker, Select } from 'antd';
import * as actions from '../store/entry';
import { PkCodeTree, Cards } from '../components';
import { EntryTable } from '../components/EnterAnalyze';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import Left from '../components/EnterAnalyze/Left';
import Right from '../components/EnterAnalyze/Right';

var echarts = require('echarts');
const Option = Select.Option;
const { RangePicker } = DatePicker;

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
export default class EnterAnalyze extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treetypelist: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: 'P009',
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

    render () {
        const { leftkeycode } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        console.log('leftkeycode', leftkeycode);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='苗木进场分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <EntryTable {...this.props} {...this.state} />
                        <Row gutter={10} style={{ margin: '10px 5px' }}>
                            <Col span={12}>
                                <Left {...this.props} {...this.state} />
                            </Col>
                            <Col span={12}>
                                <Right {...this.props} {...this.state} />
                            </Col>
                        </Row>
                    </Content>
                </Main>
            </Body>
        );
    }
    // 树选择, 重新获取: 标段、树种并置空
    onSelect (value = []) {
        console.log('onSelect  value', value);
        let keycode = value[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
    }
}
