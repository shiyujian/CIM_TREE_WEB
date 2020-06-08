import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
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
import * as actions from '../store';
import PkCodeTree from '../components/PkCodeTree';
import {
    QualityDefectsTable
} from '../components/QualityDefects';
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
export default class QualityDefects extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionOption: [],
            smallClassOption: [],
            thinClassOption: [],
            leftkeycode: '',
            resetkey: 0,
            sectionsData: [],
            smallClassesData: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getQualityDefectsType
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            this.setState({
                loading: true
            });
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的区段数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                loading: false
            });
        }
        // 设置质量缺陷类型
        let typeData = await getQualityDefectsType();
        let typeOption = [];
        typeOption.push(
            <Option key={'全部'} value={''} title={'全部'}>
        全部
            </Option>);
        if (typeData && typeData.content && typeData.content.length > 0) {
            typeData.content.map((type) => {
                typeOption.push(
                    <Option key={type.ID} value={type.Base_Name} title={type.Base_Name}>
                        {type.Base_Name}
                    </Option>
                );
            });
        }
        // 设置质量缺陷流程状态
        let flowStatusOption = [
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'已提交'} value={-1} title={'已提交'}>
                已提交
            </Option>,
            <Option key={'未通过'} value={0} title={'未通过'}>
            未通过
            </Option>,
            <Option key={'整改中'} value={1} title={'整改中'}>
                整改中
            </Option>,
            <Option key={'整改完成'} value={2} title={'整改完成'}>
                整改完成
            </Option>,
            <Option key={'确认完成'} value={3} title={'确认完成'}>
                确认完成
            </Option>
        ];
        this.setState({
            typeOption,
            flowStatusOption
        });
    }
    onSelect (keys = [], info) {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = tree.thinClassTree;
        let keycode = keys[0] || '';
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
        console.log('treeList', treeList);
        let sectionsData = [];
        if (keycode) {
            treeList.map((treeData) => {
                if (keycode === treeData.No) {
                    sectionsData = treeData.children;
                }
            });
        }
        console.log('sectionsData', sectionsData);

        this.setState({
            sectionsData
        });

        // 标段
        let user = getUser();
        let section = user.section;
        let permission = getUserIsManager();
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else {
            sectionsData.map((sectionData) => {
                if (section && section === sectionData.No) {
                    this.setSectionOption(sectionData);
                }
            });
        }
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
                this.setState({ sectionOption: sectionOptions });
            } else {
                sectionOptions.push(
                    <Option key={rst.No} value={rst.No} title={rst.Name}>
                        {rst.Name}
                    </Option>
                );
                this.setState({ sectionOption: sectionOptions });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    sectionSelect (value) {
        const {
            sectionsData
        } = this.state;
        sectionsData.map((sectionData) => {
            if (value === sectionData.No) {
                let smallClassesData = sectionData.children;
                this.setState({
                    smallClassesData
                });
                this.setSmallClassOption(smallClassesData);
            }
        });
    }
    // 设置区段选项
    setSmallClassOption (rst) {
        if (rst instanceof Array) {
            let smallclassOptions = [];
            rst.map(small => {
                smallclassOptions.push(
                    <Option key={small.No} value={small.No} title={small.Name}>
                        {small.Name}
                    </Option>
                );
            });
            smallclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ smallClassOption: smallclassOptions });
        }
    }
    // 区段选择, 重新获取: 组团
    smallClassSelect (value) {
        const {
            smallClassesData
        } = this.state;
        smallClassesData.map((smallClassData) => {
            if (value === smallClassData.No) {
                let thinClassesData = smallClassData.children;
                this.setState({
                    thinClassesData
                });
                this.setThinClassOption(thinClassesData);
            }
        });
    }
    // 设置组团选项
    setThinClassOption (rst) {
        if (rst instanceof Array) {
            let thinclassOptions = [];
            rst.map(thin => {
                thinclassOptions.push(
                    <Option key={thin.No} value={thin.No} title={thin.Name}>
                        {thin.Name}
                    </Option>
                );
            });
            thinclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                            全部
                </Option>
            );
            this.setState({ thinClassOption: thinclassOptions });
        }
    }
    thinClassSelect = () => {

    }
    // 重置
    resetinput (leftkeycode) {
        this.setState({
            resetkey: ++this.state.resetkey
        }, () => {
            this.onSelect([leftkeycode]);
        });
    }
    render () {
        const {
            leftkeycode,
            resetkey
        } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='质量缺陷' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            {...this.props}
                            {...this.state}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <QualityDefectsTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
