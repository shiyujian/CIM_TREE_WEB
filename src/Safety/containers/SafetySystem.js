import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import PkCodeTree from '../components/PkCodeTree.js';
import {SafetyTable, AddModal, SearchInfo} from '../components/SafetySystem';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/safetySystem';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Option = Select.Option;
@connect(
    state => {
        const {safety: {safetySystem = {}}, platform} = state;
        return {...safetySystem, platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)
export default class SafetySystem extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            sectionoption: [],
            typeoption: [],
            standardoption: [],
            leftkeycode: '',
            resetkey: 0
        };
    }
    async componentDidMount () {
        const {actions: {getTreeList, getTreeNodeList, getScheduleTaskList}, users, treetypes, platform: {tree = {}}} = this.props;

        if (!tree.scheduleTaskList) {
            let data = await getScheduleTaskList();
            if (data && data instanceof Array && data.length > 0) {
                data = data[0];
                let leftkeycode = data.No ? data.No :'';
                this.setState({
                    leftkeycode
                });
            }
        }else {
            let data = tree.projectList;
            if (data && data instanceof Array && data.length > 0) {
                data = data[0];
                let leftkeycode = data.No ? data.No :'';
                this.setState({
                    leftkeycode
                });
            }
        }
    }

    render () {
        const {keycode, addVisible} = this.props;
        const {
            leftkeycode
        } = this.state;

        const {platform: {tree = {}}} = this.props;
        let treeList = [];
        if (tree.scheduleTaskList) {
            treeList = tree.scheduleTaskList;
        }
        console.log('this.props', this.props);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='安全体系' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        {/* <SearchInfo {...this.props} {...this.state}/> */}
                        <SafetyTable
                            {...this.props}
                            {...this.state}
                        />
                        {
                            addVisible && <AddModal {...this.props} {...this.state} />
                        }
                    </Content>
                </Main>
            </Body>
        );
    }

    // 树选择, 重新获取: 标段、树种并置空
    onSelect (value = []) {
        let keycode = value[0] || '';
        const {actions: {setkeycode, gettreetype, getTreeList, getTree}} = this.props;
        setkeycode(keycode);
        this.setState({leftkeycode: keycode});
    }
}
