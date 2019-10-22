import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { CarPackageTable } from '../components/CarPackage';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
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
export default class CarPackage extends Component {
    biaoduan = [];
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            statusoption: [],
            leftkeycode: '',
            resetkey: 0,
            mmtypeoption: [],
            sectionsData: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                setkeycode,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getTreeList,
                getNurseryList,
                getSupplierList,
                getNurseryListOK,
                getSupplierListOK
            },
            platform: { tree = {} },
            treetypes,
            nurseryList,
            supplierList
        } = this.props;

        setkeycode('');
        if (!nurseryList) {
            let nurseryData = await getNurseryList();
            if (nurseryData && nurseryData.content) {
                await getNurseryListOK(nurseryData.content);
            }
        }
        if (!supplierList) {
            let supplierData = await getSupplierList();
            if (supplierData && supplierData.content) {
                await getSupplierListOK(supplierData.content);
            }
        }
        // 避免反复获取森林树种列表，提高效率
        if (!treetypes) {
            getTreeList();
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
        // 状态
        let statusoption = [
            <Option key={''} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'0'} value={'-1'} title={'打包'}>
                打包
            </Option>,
            <Option key={'1'} value={'0'} title={'施工提交'}>
                施工提交
            </Option>,
            <Option key={'-1'} value={'1'} title={'监理合格'}>
                监理合格
            </Option>,
            <Option key={'-1'} value={'2'} title={'监理退苗'}>
                监理退苗
            </Option>,
            <Option key={'-1'} value={'3'} title={'监理合格施工同意'}>
                监理合格施工同意
            </Option>,
            <Option key={'-1'} value={'4'} title={'监理合格施工不同意'}>
                监理合格施工不同意
            </Option>,
            <Option key={'-1'} value={'5'} title={'监理退苗施工同意'}>
                监理退苗施工同意
            </Option>,
            <Option key={'-1'} value={'6'} title={'监理退苗施工不同意'}>
                监理退苗施工不同意
            </Option>,
            <Option key={'-1'} value={'7'} title={'业主合格'}>
                业主合格
            </Option>,
            <Option key={'-1'} value={'8'} title={'业主退苗'}>
                业主退苗
            </Option>
        ];
        let mmtypeoption = [
            <Option key={'-1'} value={''} title={'全部'}>
                全部
            </Option>,
            <Option key={'1'} value={'1'} title={'地被'}>
                地被
            </Option>,
            <Option key={'2'} value={'0'} title={'乔灌'}>
                乔灌
            </Option>
        ];
        this.setState({ statusoption, mmtypeoption });
    }

    render () {
        const { keycode } = this.props;
        const {
            leftkeycode,
            sectionoption,
            statusoption,
            resetkey,
            mmtypeoption
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
                    <DynamicTitle title='车辆打包信息' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <CarPackageTable
                            key={resetkey}
                            {...this.props}
                            sectionoption={sectionoption}
                            sectionSelect={this.sectionSelect.bind(this)}
                            statusoption={statusoption}
                            mmtypeoption={mmtypeoption}
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
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }
}
