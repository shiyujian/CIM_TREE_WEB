import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import { actions as platformActions } from '_platform/store/global';
import { PkCodeTree } from '../components';
import { QualityTable } from '../components/Qualityanalyze';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { Select } from 'antd';
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
    componentDidMount = async () => {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }

    // 设置标段选项
    setSectionOption (rst) {
        if (rst instanceof Array) {
            let sectionOptions = [];
            rst.map(sec => {
                sectionOptions.push(
                    <Option key={sec.No} value={sec.No}>
                        {sec.Name}
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
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode });

        let children = [];
        sectionData.map((project) => {
            if (project.code.indexOf(keycode) !== -1) {
                children = project.children;
            }
        });
        // 标段
        this.setSectionOption(children);
    }
}
