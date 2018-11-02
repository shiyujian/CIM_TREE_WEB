import React, { Component } from 'react';
import {
    Main,
    Content,
    Sidebar,
    DynamicTitle
} from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/cell';
import { actions as platformActions } from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import { Table, Chart } from '../components/Appraising';
import { getUser } from '_platform/auth';
import { Select, Row, Col } from 'antd';

const Option = Select.Option;
@connect(
    state => {
        const {
            quality: { cell = {} },
            platform
        } = state || {};
        console.log(state);
        return { ...cell, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Appraising extends Component {
    static propTypes = {};
    biaoduan = [];
    constructor (props) {
        super(props);
        this.state = {
            treeList: [],
            sectionList: []
        };
    }
    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        const { code } = this.state;

        return (
            <Main>
                <DynamicTitle title='质量评优' {...this.props} />
                <Sidebar>
                    <PkCodeTree
                        treeData={treeList}
                        selectedKeys={code}
                        onSelect={this.onSelect.bind(this)}
                    />
                </Sidebar>
                <Content>
                    <Row>
                        <Col span={12}>
                            <Chart {...this.props} {...this.state} />
                        </Col>
                        <Col span={12}>
                            <Table {...this.props} {...this.state} />
                        </Col>
                    </Row>
                </Content>
            </Main>
        );
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
    generateSectionList (sections) {
        let sectionList = [];
        sections.map(item => {
            sectionList.push(
                <Option key={item.No} value={item.No}>
                    {item.Name}
                </Option>
            );
        });
        return sectionList;
    }

    onSelect (value = []) {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let code = value[0] || '';
        let user = getUser();
        let sections = JSON.parse(user.sections);
        let children = [];
        sectionData.map((project) => {
            if (project.code.indexOf(code) !== -1) {
                children = project.children;
            }
        });
        let sectionList = this.generateSectionList(children);
        this.setState({ code, sectionList });
    }
}
