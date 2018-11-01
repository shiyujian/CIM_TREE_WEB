import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import reducer, {actions} from '../store/index';
import { actions } from '../store/redios.js';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    Filter,
    Table,
    Addition,
    Updatemodal,
    DatumTree
} from '../components/Redios';

import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { getUser, getCompanyDataByOrgCode } from '../../_platform/auth';
export const Datumcode = window.DeathCode.DATUM_GCYX;

@connect(
    state => {
        const {
            datum: { redios = {} },
            platform
        } =
            state || {};
        return { ...redios, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Redios extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
            parent: '',
            projectName: '', // 当前用户的项目信息
            currentSection: '',
            currentSectionName: ''
        };
        this.orgCode = '';
        this.user = '';
    }

    render () {
        const { tree = [], keycode } = this.props;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='影像资料' {...this.props} />
                    <Sidebar>
                        <DatumTree
                            treeData={tree}
                            selectedKeys={keycode}
                            onSelect={this.onSelect.bind(this)}
                            {...this.state}
                        />
                    </Sidebar>
                    <Content>
                        <Filter {...this.props} {...this.state} />
                        <Table {...this.props} {...this.state} />
                    </Content>
                    <Addition {...this.props} {...this.state} />
                </Main>
                <Updatemodal {...this.props} {...this.state} />
                <Preview />
            </Body>
        );
    }
    componentDidMount = async () => {
        const {
            platform: { tree = {} },
            actions: {
                getTree,
                getSearchRedioVisible,
                getOrgTreeByCode,
                setkeycode,
                getTreeNodeList
            }
        } = this.props;
        try {
            if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
                await getTreeNodeList();
            }
            await this.getSection();
            this.setState({ loading: true });
            this.user = localStorage.getItem('QH_USER_DATA');
            this.user = JSON.parse(this.user);
            console.log('this.user', this.user);
            if (this.user.username !== 'admin') {
                let orgCode = this.user.account.org_code;
                let parent = await getCompanyDataByOrgCode(orgCode, getOrgTreeByCode);
                console.log('parent', parent);
                this.orgCode = parent.code;
                console.log('this.orgCode', this.orgCode);
            }
            await setkeycode('');
            await getSearchRedioVisible(false);
            await getTree({ code: Datumcode });
            this.setState({ loading: false });
        } catch (e) {
            console.log('e', e);
        }
    }

    // 获取当前登陆用户的标段
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();
        let sections = user.sections;
        let currentSectionName = '';
        let projectName = '';

        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map((item) => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
                        let units = item.children;
                        units.map((unit) => {
                            // 获取当前标段的名字
                            if (unit.No === section) {
                                currentSectionName = unit.Name;
                            }
                        });
                    }
                });
            }
            this.setState({
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        }
    }

    onSelect (keys = [], e) {
        let [value] = keys;
        const {
            actions: {
                getdocument,
                setcurrentcode,
                setkeycode,
                getSearchRedioVisible
            }
        } = this.props;
        console.log('keys', keys);
        console.log('e', e);
        if (e.selected) {
            let folder = JSON.parse(value);
            console.log('folder', folder);
            let org_code = folder.extra_params.orgCode;
            let code = folder.code;
            if ((this.user && this.user.username === 'admin') || this.orgCode === org_code) {
                getSearchRedioVisible(false);
                setkeycode(value);
                this.doc_type = e.node.props.title;
                this.setState({
                    isTreeSelected: e.selected,
                    selectDoc: e.node.props.title
                });
                setcurrentcode({ code: code });
                getdocument({ code: code });
            }
        }
    }
}
