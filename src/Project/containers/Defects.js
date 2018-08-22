import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import reducer, { actions } from '../store/defects';
import { Table, Addition, Edite } from '../components/Defects';
export const Defect = window.DeathCode.SYSTEM_DEFCT;
@connect(
    state => {
        const {
            project: { defects = {} },
            platform
        } = state || {};
        return { ...defects, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Defects extends Component {
    static propTypes = {};

    render () {
        return (
            <div
                style={{
                    padding: 20,
                    height: 'calc(100% - 37px)',
                    minHeight: '505px',
                    overflowY: 'auto'
                }}
            >
                <DynamicTitle title='质量缺陷' {...this.props} />
                <Table {...this.props} />
                <Addition {...this.props} />
                <Edite {...this.props} />
            </div>
        );
    }

    componentDidMount () {
        const {
            actions: { getdefectslist }
        } = this.props;
        getdefectslist({ code: Defect }).then(rst => {
            let newdefectslists = rst.metalist;
            if (rst.metalist === undefined) {
                return;
            }
            rst.metalist.map((wx, index) => {
                newdefectslists[index].on = index + 1;
            });
            const {
                actions: { setnewdefectslist }
            } = this.props;
            setnewdefectslist(newdefectslists);
        });
    }
}
