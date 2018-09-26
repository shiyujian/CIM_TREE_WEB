import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { PROJECT_UNITS } from '_platform/api';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { getUser } from '_platform/auth';
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
export default class DataStatis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
            resetkey: 0,
            typeoption: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: []
        };
    }

    componentDidMount () {
        this.biaoduan = [];
        for (let i = 0; i < PROJECT_UNITS.length; i++) {
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            });
        }
        const {
            actions: {
                getTree,
                gettreetype,
                getTreeList,
                getForestUsers,
                getTreeNodeList,
                getLittleBanAll,
                setkeycode
            },
            users,
            treetypes,
            littleBanAll,
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率
        if (!users) {
            getForestUsers();
        }
        // 避免反复获取森林树种列表，提高效率
        if (!treetypes) {
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
        if (!tree.bigTreeList) {
            getTreeNodeList();
        }
        if (!littleBanAll) {
            getLittleBanAll();
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
    }

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const {
            leftkeycode,
            typeoption
        } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='数据统计' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        数据统计
                    </Content>
                </Main>
            </Body>
        );
    }

    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (value = []) {
        let user = getUser();
        let keycode = value[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
        let sections = JSON.parse(user.sections);
        // 标段
        let rst = [];
        if (sections.length === 0) {
            // 是admin
            rst = this.biaoduan.filter(item => {
                return item.code.indexOf(keycode) !== -1;
            });
        } else {
            rst = this.biaoduan.filter(item => {
                return (
                    item.code.indexOf(keycode) !== -1 &&
                    sections.indexOf(item.code) !== -1
                );
            });
        }
        this.setSectionOption(rst);
        // 树种
        this.typeselect('');
    }

    // 设置标段选项
    setSectionOption (rst) {
        if (rst instanceof Array) {
            let sectionList = [];
            let sectionOptions = [];
            rst.map((item, index) => {
                sectionList.push(item);
            });
            let sectionData = [...new Set(sectionList)];
            sectionData.sort();
            sectionData.map(sec => {
                sectionOptions.push(
                    <Option key={sec.code} value={sec.code} title={sec.value}>
                        {sec.value}
                    </Option>
                );
            });
            this.setState({ sectionoption: sectionOptions });
        }
    }

    sectionselect (value) {
        const {
            actions: { getLittleBan }
        } = this.props;
        this.currentSection = value;
        getLittleBan({ no: value }).then(rst => {
            let smallclasses = [];
            rst.map((item, index) => {
                let smallname = {
                    code: rst[index].SmallClass,
                    name: rst[index].SmallClassName
                        ? rst[index].SmallClassName
                        : rst[index].SmallClass
                };
                smallclasses.push(smallname);
            });
            this.setSmallClassOption(smallclasses);
        });
    }

    // 设置小班选项
    setSmallClassOption (rst) {
        if (rst instanceof Array) {
            let smallclassList = [];
            let smallclassOptions = [];
            rst.map(item => {
                if (item.name) {
                    let smalls = {
                        name: item.name,
                        code: item.code
                    };
                    smallclassList.push(smalls);
                }
            });
            let smalls = [];
            let array = [];
            smallclassList.map(item => {
                if (array.indexOf(item.code) === -1) {
                    smalls.push(item);
                    array.push(item.code);
                }
            });
            smalls.map(small => {
                smallclassOptions.push(
                    <Option key={small.code} value={small.code} title={small.name}>
                        {small.name}
                    </Option>
                );
            });
            smallclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ smallclassoption: smallclassOptions });
        }
    }

    // 设置细班选项
    setThinClassOption (rst) {
        if (rst instanceof Array) {
            let thinclassList = [];
            let thinclassOptions = [];

            // 去除重复的细班,虽然细班是最小的节点，但是只要还有其他元素组成不同，所以数组里面会有相同的细班code，需要去重
            let array = [];
            let data = [];
            rst.map(item => {
                if (item.code && array.indexOf(item.code) === -1) {
                    let thins = {
                        code: item.code,
                        name: item.name
                    };
                    thinclassList.push(thins);
                    array.push(item.code);
                } else {
                    data.push(item);
                }
            });
            // 重复数据
            console.log('data', data);

            thinclassList.map(thin => {
                thinclassOptions.push(
                    <Option key={thin.code} value={thin.code} title={thin.name}>
                        {thin.name}
                    </Option>
                );
            });
            thinclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({ thinclassoption: thinclassOptions });
        }
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }
}
