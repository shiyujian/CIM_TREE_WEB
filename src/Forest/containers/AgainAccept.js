import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { AgainAcceptTable } from '../components/AgainAccept';
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
export default class AgainAccept extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            smallClassList: [], // 小班列表
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            ysTypeList: [],
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
                getThinClassTree
            },
            platform: { tree = {} },
            supervisorUsersList
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
        if (!(supervisorUsersList && supervisorUsersList.length > 0)) {
            await this.getSupervisorUsersList();
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
            <Option key={'施工提交'} value={'0'} title={'施工提交'}>
                施工提交
            </Option>,
            <Option key={'监理审核通过'} value={'1'} title={'监理审核通过'}>
                监理审核通过
            </Option>,
            <Option key={'监理审核不通过'} value={'2'} title={'监理审核不通过'}>
                监理审核不通过
            </Option>,
            <Option key={'业主审核通过'} value={'3'} title={'业主审核通过'}>
                业主审核通过
            </Option>,
            <Option key={'业主审核不通过'} value={'4'} title={'业主审核不通过'}>
                业主审核不通过
            </Option>
        ];
        // 验收类型
        let ystypeoption = [
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'土地整理'} value={'土地整理'} title={'土地整理'}>
                土地整理
            </Option>,
            <Option key={'放样点穴'} value={'放样点穴'} title={'放样点穴'}>
                放样点穴
            </Option>,
            <Option key={'挖穴'} value={'挖穴'} title={'挖穴'}>
                挖穴
            </Option>,
            <Option key={'苗木质量'} value={'苗木质量'} title={'苗木质量'}>
                苗木质量
            </Option>,
            <Option key={'土球质量'} value={'土球质量'} title={'土球质量'}>
                土球质量
            </Option>,
            <Option key={'苗木栽植'} value={'苗木栽植'} title={'苗木栽植'}>
                苗木栽植
            </Option>,
            <Option key={'苗木支架'} value={'苗木支架'} title={'苗木支架'}>
                苗木支架
            </Option>,
            <Option key={'苗木浇水'} value={'苗木浇水'} title={'苗木浇水'}>
                苗木浇水
            </Option>,
            <Option key={'大数据'} value={'大数据'} title={'大数据'}>
                大数据
            </Option>,
            <Option key={'造林面积'} value={'造林面积'} title={'造林面积'}>
                造林面积
            </Option>,
            <Option key={'总体'} value={'总体'} title={'总体'}>
                总体
            </Option>
        ];
        let ysTypeList = [
            {
                label: '全部',
                value: ''
            },
            {
                label: '土地整理',
                value: '1'
            },
            {
                label: '放样点穴',
                value: '2'
            },
            {
                label: '挖穴',
                value: '3'
            },
            {
                label: '苗木质量',
                value: '4'
            },
            {
                label: '土球质量',
                value: '5'
            },
            {
                label: '苗木栽植',
                value: '6'
            },
            {
                label: '苗木支架',
                value: '7'
            },
            {
                label: '苗木浇水',
                value: '8'
            },
            {
                label: '大数据',
                value: '9'
            },
            {
                label: '造林面积',
                value: '10'
            },
            {
                label: '总体',
                value: '11'
            }
        ];
        this.setState({ typeoption, zttypeoption, ystypeoption, ysTypeList });
    }

    // 获取监理列表
    getSupervisorUsersList = async () => {
        const {
            actions: {
                getSupervisorUsers,
                getRoles
            }
        } = this.props;
        const user = getUser();
        let section = user.section;
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (section) {
            let roles = await getRoles();
            let roleID = '';
            if (roles && roles instanceof Array && roles.length > 0) {
                roles.map((role) => {
                    if (role && role.RoleName && role.RoleName === '监理文书') {
                        roleID = role.ID;
                    }
                });
                let postData = {
                    role: roleID,
                    section: section,
                    status: 1
                };
                await getSupervisorUsers({}, postData);
            }
        }
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
                    <DynamicTitle title='重新验收' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <AgainAcceptTable
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

        // 标段
        let user = getUser();
        let section = user.section;
        let permission = getUserIsManager();
        console.log('当前用户标段', permission, section, sectionsData);
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else {
            sectionsData.map((item) => {
                if (section && section === item.No) {
                    this.setSectionOption(item);
                }
            });
        }
    }
    // 设置标段选项
    setSectionOption (rst) {
        console.log('设置标段', rst);
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
                this.setState({
                    sectionoption: sectionOptions
                });
            } else {
                sectionOptions.push(
                    <Option key={rst.No} value={rst.No} title={rst.Name}>
                        {rst.Name}
                    </Option>
                );
                rst.children.map(item => {
                    item.children.map(row => {
                        row.name = row.No.substr(-7, 7);
                    });
                });
                this.setState({
                    smallClassList: rst.children,
                    sectionoption: sectionOptions
                });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    sectionSelect (value) {
        const {
            sectionsData
        } = this.state;
        if (value) {
            sectionsData.map((sectionData) => {
                if (value === sectionData.No) {
                    let smallClassesData = sectionData.children;
                    this.setState({
                        smallClassesData
                    });
                    this.setSmallClassOption(smallClassesData);
                }
            });
        } else {
            this.setState({
                smallClassesData: [],
                smallclassoption: [],
                thinClassesData: [],
                thinclassoption: []
            });
        }
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
        if (value) {
            smallClassesData.map((smallClassData) => {
                if (value === smallClassData.No) {
                    let thinClassesData = smallClassData.children;
                    this.setState({
                        thinClassesData
                    });
                    this.setThinClassOption(thinClassesData);
                }
            });
        } else {
            this.setState({
                thinClassesData: [],
                thinclassoption: []
            });
        }
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
}
