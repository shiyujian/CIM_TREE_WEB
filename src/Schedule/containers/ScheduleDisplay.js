import React, { Component } from 'react';
import { DynamicTitle, Sidebar, Content } from '_platform/components/layout';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';
import LeftTop from '../components/Item/LeftTop';
import RightTop from '../components/Item/RightTop';
import { PkCodeTree } from '../components';
import { actions as platformActions } from '_platform/store/global';
import * as actions from '../store/entry';
@connect(
    state => {
        const { platform } = state || {};
        return { platform };
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
            leftkeycode: ''
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

    // 树选择
    onSelect (value = []) {
        console.log('onSelect  value', value);
        let keycode = value[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        this.setState({ leftkeycode: keycode });
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
        console.log('tree', tree);

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
                    <Row gutter={10} style={{ margin: '10px 5px' }}>
                        <Col span={24}>
                            <LeftTop {...this.props} {...this.state} />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ margin: '10px 5px' }}>
                        <Col span={24}>
                            <RightTop {...this.props} {...this.state} />
                        </Col>
                    </Row>
                </Content>
            </div>
        );
    }
}
