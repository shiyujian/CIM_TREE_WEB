import React, {Component} from 'react';
import { Row, Col, Card, DatePicker } from 'antd';
import moment from 'moment';
// import './index.less';
import echarts from 'echarts';
import { Sidebar } from '_platform/components/layout';
import PkCodeTree from '../PkCodeTree';
import { getAreaTreeData, getDefaultProject } from '_platform/auth';

export default class SectionAlone extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeList: [], // 树列表数据
            leftkeycode: '' // 选择标段code
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                let projectList = data.projectList || [];
                // 区域地块树
                await getThinClassTree(projectList);
            }
            let defaultProject = await getDefaultProject();
            if (defaultProject) {
                this.onSelect([defaultProject]);
            }
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const { leftkeycode } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <div>
                <Sidebar width={190}>
                    {
                        treeList.length > 0 ? <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        /> : ''
                    }
                </Sidebar>
                <div style={{marginLeft: '200px'}}>
                    <div>
                        <h2>施工单位</h2>
                        <div style={{ background: '#ECECEC', padding: '30px', height: 400 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title='账号注册总数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} /></span>}>
                                        hh
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} /></span>}>Card content</Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div>
                        <h2>监理单位</h2>
                        <div style={{ background: '#ECECEC', padding: '30px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title='账号注册总数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} /></span>}>Card content</Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} /></span>}>Card content</Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    onSelect (keys) {
        let keycode = keys[0] || '';
        console.log(keycode, '123');
        this.setState({
            leftkeycode: keycode
        });
    }
    // 切换标签页
    handleTabChangele = async (key) => {
        this.setState({
            tabKey: key
        });
    }
}
