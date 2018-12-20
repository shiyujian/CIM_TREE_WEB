import React, { Component } from 'react';
import { DynamicTitle, Sidebar, Content } from '_platform/components/layout';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { Row, Col, Select, Tabs } from 'antd';
import PlantTop from '../components/ScheduleDisplay/PlantSchedule/PlantTop';
import PlantBottom from '../components/ScheduleDisplay/PlantSchedule/PlantBottom';

import ManMachineTop from '../components/ScheduleDisplay/ManMachineSchedule/ManMachineTop';
import ManMachineBottom from '../components/ScheduleDisplay/ManMachineSchedule/ManMachineBottom';
import { PkCodeTree } from '../components';
import { actions as platformActions } from '_platform/store/global';
import { getDefaultProject } from '_platform/auth';
import * as actions from '../store/ScheduleDisplay';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
@connect(
    state => {
        const {
            schedule: { scheduleDisplay = {} },
            platform
        } = state || {};
        return { platform, scheduleDisplay };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class ScheduleDisplay extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
            sectionsData: [],
            sectionoption: []
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
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
    }

    // 树选择
    onSelect = async (value = []) => {
        let keycode = value[0] || '';
        const {
            actions: { setkeycode },
            platform: { tree = {} }
        } = this.props;
        let treeList = (tree && tree.bigTreeList) || [];
        await setkeycode(keycode);
        let sectionsData = [];
        if (keycode) {
            treeList.map((treeData) => {
                if (keycode === treeData.No) {
                    sectionsData = treeData.children;
                }
            });
        }
        await this.setState({
            leftkeycode: keycode,
            sectionsData
        });
        await this.setSectionOption(sectionsData);
    }

    // 设置标段选项
    setSectionOption (rst) {
        let sectionOptions = [];
        try {
            if (rst instanceof Array) {
                rst.map(sec => {
                    sectionOptions.push(
                        <Option key={sec.No} value={sec.No} title={sec.Name}>
                            {sec.Name}
                        </Option>
                    );
                });
                this.setState({ sectionoption: sectionOptions });
            }
        } catch (e) {
            console.log('e', e);
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

        return (
            <div>
                <DynamicTitle title='进度展示' {...this.props} />
                <Sidebar>
                    <div
                        style={{ overflow: 'hidden' }}
                        className='project-tree'
                    >
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </div>
                </Sidebar>
                <Content>
                    <Tabs>
                        <TabPane tab='栽植进度展示' key='1'>
                            <Row gutter={10} style={{ margin: '10px 5px' }}>
                                <Col span={24}>
                                    <h2>计划完成情况：</h2>
                                    <PlantTop {...this.props} {...this.state} />
                                </Col>
                            </Row>
                            <Row gutter={10} style={{ margin: '10px 5px' }}>
                                <Col span={24}>
                                    <h2>本标段计划完成情况：</h2>
                                    <PlantBottom {...this.props} {...this.state} />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab='人/机进度展示' key='2'>
                            <Row gutter={10} style={{ margin: '10px 5px' }}>
                                <Col span={24}>
                                    <h2>当日完成情况：</h2>
                                    <ManMachineTop {...this.props} {...this.state} />
                                </Col>
                            </Row>
                            <Row gutter={10} style={{ margin: '10px 5px' }}>
                                <Col span={24}>
                                    <h2>各标段完成情况：</h2>
                                    <ManMachineBottom {...this.props} {...this.state} />
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
        );
    }
}
