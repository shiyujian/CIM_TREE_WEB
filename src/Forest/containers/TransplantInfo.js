import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { TransplantInfoTable } from '../components/TransplantInfo';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUser,
    getAreaTreeData,
    getUserIsManager
} from '_platform/auth';
const Option = Select.Option;
@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class TransplantInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            typeoption: [],
            statusoption: [],
            locationoption: [],
            resetkey: 0,
            bigType: ''
        };
    }
    getbigTypeName (type) {
        switch (type) {
            case '1':
                return '常绿乔木';
            case '2':
                return '落叶乔木';
            case '3':
                return '亚乔木';
            case '4':
                return '灌木';
            case '5':
                return '草本';
            default:
                return '';
        }
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeList,
                getTreeNodeList,
                setkeycode,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            treetypes,
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林树种列表，提高效率
        if (!treetypes) {
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }

        setkeycode('');
        // 类型
        let typeoption = [
            <Option key={'-1'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'1'} value={'1'} title={'常绿乔木'}>
                常绿乔木
            </Option>,
            <Option key={'2'} value={'2'} title={'落叶乔木'}>
                落叶乔木
            </Option>,
            <Option key={'3'} value={'3'} title={'亚乔木'}>
                亚乔木
            </Option>,
            <Option key={'4'} value={'4'} title={'灌木'}>
                灌木
            </Option>,
            <Option key={'5'} value={'5'} title={'地被'}>
                地被
            </Option>
        ];
        this.setState({ typeoption });
        // 状态
        let statusoption = [
            <Option key={'-1'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'1'} value={'未抽查'} title={'未抽查'}>
                未抽查
            </Option>,
            <Option key={'2'} value={'0,3'} title={'抽查通过'}>
                抽查通过
            </Option>,
            <Option key={'3'} value={'1,2'} title={'抽查退回'}>
                抽查退回
            </Option>,
            <Option key={'4'} value={'不合格'} title={'不合格'}>
                不合格
            </Option>
        ];
        this.setState({ statusoption });
        // 定位
        let locationoption = [
            <Option key={'-1'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'1'} value={'1'} title={'已定位'}>
                已定位
            </Option>,
            <Option key={'2'} value={'0'} title={'未定位'}>
                未定位
            </Option>
        ];
        this.setState({ locationoption });
    }

    // 类型选择, 重新获取: 树种
    typeselect (value) {
        const { treetypes } = this.props;
        this.setState({ bigType: value });
        let selectTreeType = [];
        treetypes.map(item => {
            if (item.TreeTypeNo == null) {
            }
            if (item.TreeTypeNo) {
                try {
                    let code = item.TreeTypeNo.substr(0, 1);
                    if (code === value) {
                        selectTreeType.push(item);
                    }
                } catch (e) {}
            }
        });
        this.setTreeTypeOption(selectTreeType);
    }

    // 设置树种选项
    setTreeTypeOption (rst) {
        let treetypeoption = [];
        if (rst instanceof Array) {
            treetypeoption = rst.map(item => {
                return (
                    <Option key={item.ID} value={item.ID} title={item.TreeTypeName}>
                        {item.TreeTypeName}
                    </Option>
                );
            });
        }
        treetypeoption.unshift(
            <Option key={-1} value={''} title={'全部'}>
                    全部
            </Option>
        );
        this.setState({ treetypeoption, treetypelist: rst });
    }

    // 重置
    resetinput () {
        this.setState({
            resetkey: ++this.state.resetkey
        });
    }
    render () {
        const {
            resetkey
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='移植信息' {...this.props} />
                    <Content>
                        <TransplantInfoTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            typeselect={this.typeselect.bind(this)}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
