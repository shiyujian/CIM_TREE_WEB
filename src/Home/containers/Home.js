import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { actions as platformActions } from '_platform/store/global';
import {News, Datum} from '../components';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {actions as newsActions} from '../store/news';
import {actions as datumActions} from '../store/datum';
import banner from '../components/images/banner.png';

@connect(
    state => {
        const {home: {news = {}, datum = {}}, platform} = state || {};
        return {...news, ...datum, platform};
    },
    dispatch => ({
        actions: bindActionCreators({...newsActions, ...datumActions, ...platformActions, ...previewActions}, dispatch)
    })
)

export default class Home extends Component {
    render () {
        const props = this.props;
        const bannerUrl = banner;
        console.log('bannerUrl', bannerUrl);
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <img style={{width: '100%'}}src={bannerUrl} />
                    </Col>
                </Row>
                <Row gutter={10} style={{margin: '5px 5px 5px 5px'}}>
                    <Col span={12}>
                        {News && <News {...props} />}
                    </Col>
                    <Col style={{marginTop: '3px'}} span={12}>
                        {Datum && <Datum {...props} />}
                    </Col>
                </Row>
                <Preview />
            </div>
        );
    }
}
