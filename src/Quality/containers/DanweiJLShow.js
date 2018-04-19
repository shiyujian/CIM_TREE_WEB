import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree';
import DwJLShow from '../components/DwJLShow';
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD} from '_platform/api';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class DanweiJLShow extends Component {
    render() {
        return (
            <Main>
                <DwJLShow/>
            </Main>
        );
    }

}