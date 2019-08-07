import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
// import {PkCodeTree} from '../components';
import { LeaveTable } from '../components/Leave';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
const Option = Select.Option;
@connect(
    state => {
        const { selfcare, platform } = state;
        return { ...selfcare, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Leave extends Component {
    constructor (props) {
        super(props);
        this.state = {
            typeoption: [],
            standardoption: [],
            leftkeycode: '',
            resetkey: 0
        };
    }
    componentDidMount () {
        // 类型
        let typeoption = [
            <Option key={'-1'} value={''}>
                全部
            </Option>,
            <Option key={'1'} value={'1'}>
                病假
            </Option>,
            <Option key={'2'} value={'2'}>
                事假
            </Option>,
            <Option key={'2'} value={'2'}>
                年假
            </Option>
        ];
        this.setState({ typeoption });
        // 状态
        let standardoption = [
            <Option key={'-1'} value={''}>
                全部
            </Option>,
            <Option key={'1'} value={'1'}>
                通过
            </Option>,
            <Option key={'2'} value={'0'}>
                不通过
            </Option>
        ];
        this.setState({ standardoption });
    }

    render () {
        const { keycode } = this.props;
        const {
            typeoption,
            standardoption,
            leftkeycode,
            resetkey
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='个人请假' {...this.props} />
                    <Content>
                        <LeaveTable
                            key={resetkey}
                            {...this.props}
                            typeoption={typeoption}
                            standardoption={standardoption}
                            leftkeycode={leftkeycode}
                            keycode={keycode}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }

    // 树选择, 重新获取: 标段、树种并置空
    onSelect (value = []) {
        let keycode = value[0] || '';
        const {
            actions: { setkeycode, gettreetype, getTreeList, getTree }
        } = this.props;
        // setkeycode(keycode);
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });

        // //标段
        // getTreeList({},{field:'section',no:keycode,paginate:false})
        // .then(rst => {
        //     this.setSectionOption(rst)
        // })
        // //树种
        // gettreetype({},{no:keycode,paginate:false})
        // .then(rst => {
        //     this.setTreeTypeOption(rst)
        // })
    }
}
