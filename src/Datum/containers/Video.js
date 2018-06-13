import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/index';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { Filter, Table, Addition, Updatemodal } from '../components/Video';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { getUser } from '../../_platform/auth';
import { PROJECT_UNITS } from '../../_platform/api';
export const Datumcode = window.DeathCode.DATUM_VIDEO;

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
export default class Video extends Component {
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
        return (
            <Body>
                <Main>
                    <DynamicTitle title='视频资料' {...this.props} />
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

    componentDidMount () {
        const {
            actions: { getdocument }
        } = this.props;
        getdocument({ code: Datumcode });
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
}
