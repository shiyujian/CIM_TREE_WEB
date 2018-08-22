import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import { actions as platformActions } from '_platform/store/global';
import { Cards, PkCodeTree } from '../components';
import { QualityTable } from '../components/Qualityanalyze';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { Row, Col, Input, Icon, DatePicker, Select, Spin } from 'antd';
import Blade from '_platform/components/panels/Blade';
import { PROJECT_UNITS } from '_platform/api';
import moment from 'moment';
const { RangePicker } = DatePicker;
const Option = Select.Option;
var echarts = require('echarts');

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
export default class Qualityanalyze extends Component {
    biaoduan = [];
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
            section: ''
        };
    }
    componentDidMount () {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        this.biaoduan = [];
        PROJECT_UNITS[0].units.map(item => {
            this.biaoduan.push(item);
        });
        PROJECT_UNITS[1].units.map(item => {
            this.biaoduan.push(item);
        });
        if (!tree.bigTreeList) {
            getTreeNodeList();
        }
    }

    // 设置标段选项
    setSectionOption (rst) {
        if (rst instanceof Array) {
            let sectionList = [];
            let sectionOptions = [];
            let sectionoption = rst.map((item, index) => {
                if (item.Section) {
                    let sections = item.Section;
                    sectionList.push(sections);
                }
            });
            let sectionData = [...new Set(sectionList)];
            sectionData.sort();
            sectionData.map(sec => {
                sectionOptions.push(
                    <Option key={sec.code} value={sec.code}>
                        {sec.value}
                    </Option>
                );
            });
            sectionOptions.unshift(
                <Option key={-1} value={''}>
                    全部
                </Option>
            );
            this.setState({ sectionoption: sectionOptions });
        }
    }

    render () {
        const { keycode } = this.props;
        const { leftkeycode, sectionoption, section } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='种植质量分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <QualityTable
                            key={leftkeycode}
                            {...this.props}
                            sectionoption={sectionoption}
                            section={section}
                            leftkeycode={leftkeycode}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

    // 树选择
    onSelect (value = []) {
        let keycode = value[0] || '';
        const {
            actions: { getTree }
        } = this.props;
        this.setState({ leftkeycode: keycode });
        // 标段
        let rst = [];
        rst = this.biaoduan.filter(item => {
            return item.code.indexOf(keycode) !== -1;
        });
        this.setSectionOption(rst);
    }
}
