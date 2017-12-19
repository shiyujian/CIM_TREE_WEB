/**
 * Created by tinybear on 17/9/19.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as planActions} from '../store/plan';
import {actions as designChangeActions} from '../store/designChange';
import {DynamicTitle,Sidebar,Content} from '_platform/components/layout';

import ChangeDesignContent from '../components/ChangeDesignList';

@connect(
    state => {
        const {platform,overall:{ designChange={},plan={} }} = state;
        return {platform,designChange,plan};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...designChangeActions,...planActions}, dispatch),
    }),
)
class ChangeDesignStart extends Component{

    state = {
        role :1
    };

    render(){
        return (<div>
            <DynamicTitle title="发起变更" {...this.props}/>
            <ChangeDesignContent {...this.props} role={3}></ChangeDesignContent>
        </div>)
    }
}

export default ChangeDesignStart;

