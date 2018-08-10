import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { PROJECT_UNITS } from '_platform/api';
import { CarPackageTable } from '../components/CarPackage';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
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
            mmtypeoption: []
        };
    }
    componentDidMount () {
        const {
            actions: {
                getTree,
                gettreetype,
                getTreeList,
                getForestUsers,
                getTreeNodeList,
                setkeycode
            },
            users,
            platform: { tree = {} }
        } = this.props;
        this.biaoduan = [];
        for (let i = 0; i < PROJECT_UNITS.length; i++) {
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            });
        }

        setkeycode('');
        // 避免反复获取森林用户数据，提高效率
        if (!users) {
            getForestUsers();
        }
        if (!tree.bigTreeList) {
            getTreeNodeList();
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
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='车辆打包信息' {...this.props} />
                    <Sidebar width={190}>
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
                            sectionselect={this.sectionselect.bind(this)}
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
    // 标段选择, 重新获取: 小班、细班、树种
    sectionselect (value) {}
    // 设置标段选项
    setSectionOption (rst) {
        let user = getUser();
        let section = JSON.parse(user.sections);
        if (rst instanceof Array) {
            let sectionList = [];
            let sectionOptions = [];
            let sectionoption = rst.map((item, index) => {
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
            // if(section.length === 0){   //admin用户赋给全部的查阅权限
            //     sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            // }
            this.setState({ sectionoption: sectionOptions });
        }
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
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
    }
}
