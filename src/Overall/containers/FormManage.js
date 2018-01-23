import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/formmanage';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { WorkTree, SearchInfo, TableInfo } from '../components/FormManage';
import moment from 'moment';
import { Tabs } from 'antd';


@connect(
    state => {
        const { overall: { formmanage = {} }, platform } = state;
        return { platform, ...formmanage };
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions }, dispatch),
    }),
)

export default class FormManage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <DynamicTitle title="表单管理" {...this.props} />
                <Sidebar>
                    <WorkTree {...this.props} />
                </Sidebar>
                <Content>
                    <SearchInfo {...this.props}/>
                    <TableInfo {...this.props}/>
                </Content>
            </div>
        )
    }
}