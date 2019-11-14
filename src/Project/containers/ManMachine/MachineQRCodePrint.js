import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../../store/ManMachine/machineQRCodePrint';
import {
    MachineQRCodePrintTable
} from '../../components/ManMachine/MachineQRCodePrint';

@connect(
    state => {
        const {
            platform,
            project: { machineQRCodePrint }
        } = state;
        return { platform, ...machineQRCodePrint };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class MachineQRCodePrint extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount = async () => {
    }
    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='机械二维码' {...this.props} />
                    <Content>
                        <MachineQRCodePrintTable
                            {...this.props}
                            {...this.state}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
