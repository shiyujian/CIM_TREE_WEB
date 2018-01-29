/**
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
// import { actions as platformActions } from '_platform/store/global';
import {Row, Col, Modal, Card, Steps} from 'antd';
import { SOURCE_API, STATIC_DOWNLOAD_API, WORKFLOW_CODE, DefaultZoomLevel } from '_platform/api';
import './Register.css';
import {TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const Step = Steps.Step;

export default class HiddenModle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: [],
            currentUnitCode: '',
            currentSteps: 0,
            detailObj: {},
            currentSelectValue: '',
            leafletCenter: [22.516818, 113.868495],
        }
    }
    componentDidMount() {

    }

    // onDetailClick = (record, index) => {
    //     const code = WORKFLOW_CODE.安全隐患上报流程;
    //     const {
    //         actions: {
    //             getWrokflowByID
    //         }
    //     } = this.props;
    //     let detailObj = {};
    //     let array = [];
    //     const location = record.coordinate;
    //     array.push(location.latitude);
    //     array.push(location.longitude);
    //     this.setState({ leafletCenter: array })
    //     detailObj.riskName = record.riskContent;
    //     detailObj.projectName = record.projectName;
    //     detailObj.unitName = record.unitName;
    //     detailObj.images = record.images;
    //     this.setState({ currentSteps: this.getRiskState(record.status) });
    //     getWrokflowByID({ id: record.id, code: code }).then(rst => {
    //         let len = rst[0].workflow.states.length;
    //         for (let i = 0; i < len; i++) {
    //             debugger
    //             if (rst[0].workflow.states[i].name === "隐患上报" && rst[0].workflow.states[i].participants.length !== 0) {
    //                 detailObj.finder = rst[0].workflow.states[i].participants[0].executor.person_name;
    //             } else if (rst[0].workflow.states[i].name === "隐患核查" && rst[0].workflow.states[i].participants.length !== 0) {
    //                 detailObj.supervision = rst[0].workflow.states[i].participants[0].executor.person_name;
    //             } else if (rst[0].workflow.states[i].name === "隐患整改" && rst[0].workflow.states[i].participants.length !== 0) {
    //                 detailObj.charger = rst[0].workflow.states[i].participants[0].executor.person_name;
    //             }
    //         }
    //         this.setState({ detailObj });
    //     });
    // }
    render() {
        const { detailObj } = this.state;
        // detailObj.riskName = detailObj.riskName ? detailObj.riskName : '';
        // detailObj.projectName = detailObj.projectName ? detailObj.projectName : '';
        // detailObj.unitName = detailObj.unitName ? detailObj.unitName : '';
        // detailObj.finder = detailObj.finder ? detailObj.finder : '';
        // detailObj.supervision = detailObj.supervision ? detailObj.supervision : '无';
        // detailObj.charger = detailObj.charger ? detailObj.charger : '无';
        // detailObj.images = detailObj.images ? detailObj.images : [];
        // let array = [];
        // for (let i = 0; i < detailObj.images.length; i++) {
        //     array.push(<Col span={6}>
        //         <Card>
        //             <div>
        //                 <img style={{ width: 115, height: 72 }} src={`${SOURCE_API}${detailObj.images[i]}`} />
        //             </div>
        //         </Card>
        //     </Col>);
        // }

        return (
            <Modal
                visible = {true}
            >
                <Row><h2 style={{ textAlign: 'center' }}>安全隐患详情</h2></Row>
                <Row style={{ marginTop: 15 }}>
                    <Col span={8}><span style={{ fontSize: 16 }}>{`隐患名称：`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`发现人员：`}</span></Col>
                </Row>
                <Row>
                    <Col span={16}><span style={{ fontSize: 16 }}>{`工程名称：`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`监理工程师：`}</span></Col>
                </Row>
                <Row>
                    <Col span={8}><span style={{ fontSize: 16 }}>{`工程部位：`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`整改负责人：`}</span></Col>
                </Row>
                <Row style={{ marginTop: 30 }}>
                    <Steps /*current={this.state.currentSteps}*/>
                        <Step title="发起" />
                        <Step title="确认" />
                        <Step title="整改" />
                        <Step title="审核" />
                    </Steps>
                </Row>
                <Row style={{ marginTop: 20 }} gutter={5} style={{ height: 120 }}>
                    {/*array*/}
                </Row>
                <Card style={{ marginTop: 50 }}>
                    <Map center={this.state.leafletCenter} zoom={DefaultZoomLevel} zoomControl={false}
                        style={{ position: 'relative', height: 400, width: '100%' }}>
                        <TileLayer url={URL} subdomains={['7']} />
                    </Map>
                </Card>
            </Modal>
        );
    }
}


