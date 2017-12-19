import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../store/subitem';
import {actions as platformActions} from '_platform/store/global';
import {Main, DynamicTitle} from '_platform/components/layout';
import {MainContent} from '../components/Subitem';
import {Content} from '../components'

@connect(
	state => {
		const {subitem = {}} = state.quality || {};
		return subitem;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Subitem extends Component {

    static propTypes = {};
	render() {
		return (
            <Main>
                <DynamicTitle title="分项验收" {...this.props} />
                <Content>
                    <MainContent></MainContent>
                </Content>
            </Main>
		);
	}

}
