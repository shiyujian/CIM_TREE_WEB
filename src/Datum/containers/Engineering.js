import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/engineering';
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
} from '../components/Engineering';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { getUser } from '../../_platform/auth';
import { PROJECT_UNITS } from '../../_platform/api';
export const Datumcode = window.DeathCode.DATUM_GCWD;

// @connect(
// 	state => {
// 		const {engineering = {}, platform} = state || {};
// 		return {...engineering, platform};
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
// 	})
// )
@connect(
    state => {
        const {
            datum: { engineering = {} },
            platform
        } =
            state || {};
        return { ...engineering, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Engineering extends Component {
    doc_type = '';
    array = [];
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
    }

    render () {
        const { tree = [], keycode } = this.props;

        return (
            <Body>
                <Main>
                    <DynamicTitle title='工程文档' {...this.props} />
                    <Sidebar>
                        <DatumTree
                            treeData={tree}
                            selectedKeys={keycode}
                            onSelect={this.onSelect.bind(this)}
                            {...this.state}
                        />
                    </Sidebar>
                    <Content>
                        <Filter
                            {...this.props}
                            {...this.state}
                            array={this.array}
                        />
                        <Table {...this.props} {...this.state} />
                    </Content>
                    <Addition
                        {...this.props}
                        {...this.state}
                        doc_type={this.doc_type}
                        array={this.array}
                    />
                </Main>
                <Updatemodal
                    {...this.props}
                    {...this.state}
                    doc_type={this.doc_type}
                    array={this.array}
                />
                <Preview />
            </Body>
        );
    }

    async componentDidMount () {
        const {
            actions: { getTree, getTreeNodeList, searchEnginVisible }
        } = this.props;
        this.setState({ loading: true });
        searchEnginVisible(false);
        getTree({ code: Datumcode }).then(({ children }) => {
            this.setState({ loading: false });
        });
        if (this.props.Doc) {
            this.setState({ isTreeSelected: true });
        }
        this.array = await getTreeNodeList();
        this.getSection();
    }

    // 获取当前登陆用户的标段
    getSection () {
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
                PROJECT_UNITS.map((item) => {
                    if (code[0] === item.code) {
                        projectName = item.value;
                        let units = item.units;
                        units.map((unit) => {
                            // 获取当前标段的名字
                            if (unit.code === section) {
                                currentSectionName = unit.value;
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

    onSelect (value = [], e) {
        const {
            actions: { searchEnginVisible }
        } = this.props;
        searchEnginVisible(false);
        const [code] = value;
        const {
            actions: { getdocument, setcurrentcode, setkeycode }
        } = this.props;
        setkeycode(code);
        if (code === undefined) {
            return;
        }
        let parent = code.split('--')[3];
        this.doc_type = e.node.props.title;
        this.setState({
            isTreeSelected: e.selected,
            parent: parent,
            selectDoc: e.node.props.title
        });
        setcurrentcode({ code: code.split('--')[1] });
        getdocument({ code: code.split('--')[1] });
    }
}
