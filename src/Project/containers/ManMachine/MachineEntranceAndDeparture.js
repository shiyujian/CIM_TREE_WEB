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
    getUserIsManager,
    getCompanyDataByOrgCode
} from '_platform/auth';
import {
    ORGTYPE
} from '_platform/api';
import { actions } from '../../store/ManMachine/machineEntranceAndDeparture';
import {
    MachineEntranceAndDepartureTable,
    PkCodeTree
} from '../../components/ManMachine/MachineEntranceAndDeparture';
const Option = Select.Option;

@connect(
    state => {
        const {
            platform,
            project: { machineEntranceAndDeparture }
        } = state;
        return { platform, ...machineEntranceAndDeparture };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class MachineEntranceAndDeparture extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionOption: [],
            leftkeycode: '',
            resetkey: 0,
            sectionsData: [],
            smallClassesData: [],
            companyList: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getMachineTypes,
                getOrgTreeByOrgType
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的区段数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
        let permission = getUserIsManager();
        let companyList = [];
        if (permission) {
            let orgData = await getOrgTreeByOrgType({orgtype: '施工单位'});
            if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
                if (orgData.content && orgData.content instanceof Array) {
                    companyList = companyList.concat(orgData.content);
                }
            }
            await this.getUserCompany();
        } else {
            let parentData = await this.getUserCompany();
            companyList.push(parentData);
        }
        // 机械设备类别列表
        let machineTypeData = await getMachineTypes();
        let machineTypeOption = [];
        machineTypeOption.push(
            <Option key={'全部'} value={''} title={'全部'}>
                全部
            </Option>);
        if (machineTypeData && machineTypeData instanceof Array && machineTypeData.length > 0) {
            machineTypeData.map((type) => {
                machineTypeOption.push(
                    <Option key={type.ID} value={type.Name} title={type.Name}>
                        {type.Name}
                    </Option>
                );
            });
        }
        this.setState({
            machineTypeOption,
            companyList
        });
    }
    // 获取用户自己的公司信息
    getUserCompany = async () => {
        const {
            actions: {
                getParentOrgTreeByID
            }
        } = this.props;
        try {
            let user = getUser();
            let parentData = '';
            // admin没有部门
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                let orgID = user.org;
                parentData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                if (parentData && parentData.ID) {
                    let companyOrgID = parentData.ID;
                    this.setState({
                        userCompany: companyOrgID
                    });
                }
            }
            return parentData;
        } catch (e) {
            console.log('getUserCompany', e);
        }
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
                this.setState({
                    sectionOption: sectionOptions
                });
            } else {
                sectionOptions.push(
                    <Option key={rst.No} value={rst.No} title={rst.Name}>
                        {rst.Name}
                    </Option>
                );
                this.setState({
                    sectionOption: sectionOptions
                });
            }
        } catch (e) {
            console.log('e', e);
        }
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
                    <DynamicTitle title='机械进离场' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <MachineEntranceAndDepartureTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
