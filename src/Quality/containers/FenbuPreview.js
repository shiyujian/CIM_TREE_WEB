import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD} from '_platform/api';
import {FenbuTable1,FenbuTable2,FenbuTable3} from '../components/YanshouTable'


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
export default class FenbuPreview extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Main>
                <Content>
                    <div>
                        <Link to='/quality/yanshou/fenbu/record'>
                            <Button type='primary' style={{marginLeft:'20px'}}>返回</Button>
                        </Link>
                        <Button type='primary' style={{marginLeft:'20px'}}>打印</Button>
                    </div>
                    <FenbuTable1/>
                    <FenbuTable2/>
                    <FenbuTable3/>
                </Content>
            </Main>
        );
    }

}
