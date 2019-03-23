import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { DegitalAcceptTable } from '../components/DegitalAccept';
import { actions as platformActions } from '_platform/store/global';
import {
    getUser,
    getAreaTreeData,
    getDefaultProject,
    getUserIsManager
} from '_platform/auth';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
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
export default class DegitalAccept extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            leftkeycode: '',
            resetkey: 0,
            sectionsData: [],
            smallClassesData: [],
            treetypeoption: [] // 树种
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getForestUsers,
                getTreeNodeList,
                setkeycode,
                getDigitalAcceptList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getTreeList
            },
            users,
            treetypes,
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率
        if (!users) {
            getForestUsers();
        }
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
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
        // 类型
        let typeoption = [
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'常绿乔木'} value={'1'} title={'常绿乔木'}>
                常绿乔木
            </Option>,
            <Option key={'落叶乔木'} value={'2'} title={'落叶乔木'}>
                落叶乔木
            </Option>,
            <Option key={'亚乔木'} value={'3'} title={'亚乔木'}>
                亚乔木
            </Option>,
            <Option key={'灌木'} value={'4'} title={'灌木'}>
                灌木
            </Option>,
            <Option key={'地被'} value={'5'} title={'地被'}>
                地被
            </Option>
        ];
        // 状态
        let zttypeoption = [
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'未申请'} value={'0'} title={'未申请'}>
                未申请
            </Option>,
            <Option key={'待验收'} value={'1'} title={'待验收'}>
                待验收
            </Option>,
            <Option key={'完成'} value={'2'} title={'完成'}>
                完成
            </Option>,
            <Option key={'退回'} value={'3'} title={'退回'}>
                退回
            </Option>,
            <Option key={'暂存'} value={'4'} title={'暂存'}>
                暂存
            </Option>
        ];
        // 验收类型
        let ystypeoption = [
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'土地整理'} value={'1'} title={'土地整理'}>
                土地整理
            </Option>,
            <Option key={'放样点穴'} value={'2'} title={'放样点穴'}>
                放样点穴
            </Option>,
            <Option key={'挖穴'} value={'3'} title={'挖穴'}>
                挖穴
            </Option>,
            <Option key={'苗木质量'} value={'4'} title={'苗木质量'}>
                苗木质量
            </Option>,
            <Option key={'土球质量'} value={'5'} title={'土球质量'}>
                土球质量
            </Option>,
            <Option key={'苗木栽植'} value={'6'} title={'苗木栽植'}>
                苗木栽植
            </Option>,
            <Option key={'苗木支架'} value={'7'} title={'苗木支架'}>
                苗木支架
            </Option>,
            <Option key={'苗木浇水'} value={'8'} title={'苗木浇水'}>
                苗木浇水
            </Option>,
            <Option key={'大数据'} value={'9'} title={'大数据'}>
                大数据
            </Option>,
            <Option key={'造林面积'} value={'10'} title={'造林面积'}>
                造林面积
            </Option>,
            <Option key={'总体'} value={'11'} title={'总体'}>
                总体
            </Option>
        ];
        this.setState({ typeoption, zttypeoption, ystypeoption });
    }

    render () {
        const { keycode } = this.props;
        const {
            leftkeycode,
            sectionoption,
            smallclassoption,
            thinclassoption,
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
                    <DynamicTitle title='数字化验收' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <DegitalAcceptTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            sectionoption={sectionoption}
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallclassoption={smallclassoption}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinclassoption={thinclassoption}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                            leftkeycode={leftkeycode}
                            keycode={keycode}
                            typeselect={this.typeselect.bind(this)}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys = [], info) {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = tree.thinClassTree;

        let user = getUser();
        let keycode = keys[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });

        let sectionsData = [];
        if (keycode) {
            treeList.map((treeData) => {
                if (keycode === treeData.No) {
                    sectionsData = treeData.children;
                }
            });
        }
        this.setState({
            sectionsData
        });
        this.typeselect('');

        // 标段
        let sections = JSON.parse(user.sections);
        let permission = getUserIsManager();
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else {
            sectionsData.map((sectionData) => {
                if (sections[0] === sectionData.No) {
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
                this.setState({ sectionoption: sectionOptions });
            } else {
                sectionOptions.push(
                    <Option key={rst.No} value={rst.No} title={rst.Name}>
                        {rst.Name}
                    </Option>
                );
                this.setState({ sectionoption: sectionOptions });
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
    // 设置小班选项
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
            this.setState({ smallclassoption: smallclassOptions });
        }
    }

    // 小班选择, 重新获取: 细班
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

    // 设置细班选项
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
            this.setState({ thinclassoption: thinclassOptions });
        }
    }

    // 细班选择, 重新获取: 树种
    thinClassSelect (value) {
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
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
                } catch (e) { }
            }
        });
        this.setTreeTypeOption(selectTreeType);
    }
    // 设置树种选项
    setTreeTypeOption (rst) {
        if (rst instanceof Array) {
            let treetypeoption = rst.map(item => {
                return (
                    <Option key={item.ID} value={item.ID} title={item.TreeTypeName}>
                        {item.TreeTypeName}
                    </Option>
                );
            });
            treetypeoption.unshift(
                <Option key={'全部'} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ treetypeoption, treetypelist: rst });
        }
    }
}