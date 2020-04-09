import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { VolunteerTreeTable } from '../components/VolunteerTree';
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
export default class VolunteerTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            typeoption: [],
            leftkeycode: '',
            resetkey: 0,
            bigType: '',
            sectionsData: [],
            smallClassesData: []
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
        // 树种
        this.typeselect('');

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
        if (rst instanceof Array) {
            let treetypeoption = rst.map(item => {
                return (
                    <Option key={item.ID} value={item.ID} title={item.TreeTypeName}>
                        {item.TreeTypeName}
                    </Option>
                );
            });
            treetypeoption.unshift(
                <Option key={-1} value={''} title={'全部'}>
                    全部
                </Option>
            );
            this.setState({ treetypeoption, treetypelist: rst });
        }
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
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
                    <DynamicTitle title='义务植树信息' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <VolunteerTreeTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                            typeselect={this.typeselect.bind(this)}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
