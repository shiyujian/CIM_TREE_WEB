import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/index';
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
} from '../components/Datum';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { getUser } from '_platform/auth';
export const Datumcode = window.DeathCode.DATUM_DATUM;

@connect(
    state => {
        const { datum = {}, platform } = state || {};
        return { ...datum, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Datum extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
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
                    <DynamicTitle title='制度标准' {...this.props} />
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
                <Updatemodal {...this.props} doc_type={this.doc_type} {...this.state} />
                <Preview />
            </Body>
        );
    }

    componentDidMount = async () => {
        const {
            actions: { getTree, getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        this.setState({ loading: true });
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
        getTree({ code: Datumcode }).then(({ children }) => {
            this.setState({ loading: false });
        });
        if (this.props.Doc) {
            this.setState({ isTreeSelected: true });
        }
        await this.getSection();
    }

    // 获取当前登陆用户的标段
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();
        let section = user.section;
        let currentSectionName = '';
        let projectName = '';

        if (section) {
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

    onSelect (value = [], e) {
        const [code] = value;
        const {
            actions: { getdocument, setcurrentcode, setkeycode }
        } = this.props;
        setkeycode(code);
        if (code === undefined) {
            return;
        }
        this.doc_type = e.node.props.title;
        this.setState({ isTreeSelected: e.selected });
        setcurrentcode({ code: code.split('--')[1] });
        getdocument({ code: code.split('--')[1] });
    }
}
