/**
 * Created by tinybear on 17/8/15.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as planActions} from '../store/plan';
import {DynamicTitle} from '_platform/components/layout';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import ReportResultList from '../components/ReportResultList';

@connect(
    state => {
        const {platform,overall:{plan={}}} = state;
        return {platform,plan};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...planActions,...previewActions}, dispatch),
    }),
)
class ApprovalResult extends Component {
    render(){
        return (<div>
            <DynamicTitle title="设计审查" {...this.props}/>
            <div style={{marginLeft:'160px'}}>
                {/*<ApprovalResultPanel {...this.props}></ApprovalResultPanel>*/}
                <ReportResultList {...this.props} role={2}></ReportResultList>
                <Preview></Preview>
            </div>
        </div>)
    }
}

export default ApprovalResult;
