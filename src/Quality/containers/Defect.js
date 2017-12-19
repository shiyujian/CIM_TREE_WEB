import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../store/item';
import {actions as platformActions} from '_platform/store/global';
import {Main, DynamicTitle} from '_platform/components/layout';
import {MainContent} from '../components/Defect';
import {Content} from '../components'

@connect(
	state => {
		const {item = {}} = state.quality || {};
		return item;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Defect extends Component {

    static propTypes = {};
	render() {
		return (
            <Main>
                <DynamicTitle title="质量缺陷" {...this.props} />
                <Content>
                    <MainContent></MainContent>
                </Content>
            </Main>
		);
	}

}
