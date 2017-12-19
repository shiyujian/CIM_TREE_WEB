/**
 * Created by tinybear on 17/8/14.
 * 成果上报
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as planActions} from '../store/plan';
import {DynamicTitle} from '_platform/components/layout';
import Preview from '_platform/components/layout/Preview';
import ReportResultList from '../components/ReportResultList';

@connect(
    state => {
        const {platform,overall:{plan={}}} = state;
        return {platform,plan};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...planActions}, dispatch),
    }),
)
class ReportResult extends Component{

    render(){
        return (<div>
            <DynamicTitle title="设计上报" {...this.props}/>
            <div style={{marginLeft:'160px'}}>
                <ReportResultList {...this.props} role={1}></ReportResultList>
                <Preview></Preview>
            </div>
        </div>)
    }
}

export default ReportResult;

