import React, {Component} from 'react';
import {Content, DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/cells';
import {actions as platformActions} from '_platform/store/global';
import Detail from "../components/Cell/Detail";
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';

@connect(
    state => {
        const {quality: {cells = {}}, platform} = state || {};
        return {...cells, platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch),
    }),
)
export default class Cells extends Component {
    static propTypes = {};
    render() {
        return (
			<Content>
				<DynamicTitle title="检验批详情" {...this.props}/>
				<Detail {...this.props}/>
				<Preview/>
			</Content>
        );
    }

    componentDidMount() {
        const {
            match: {
                params: {cell_id}
                    = {}
            }={},
            actions: {getDetail},
        } = this.props;
        getDetail({cell_id});
    }
};

