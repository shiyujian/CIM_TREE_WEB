import React, { Component } from 'react';
import { Row, Col, Modal, Card, Steps, Button } from 'antd';
import { CUS_TILEMAP, WMSTILELAYERURL, TILEURLS, INITLEAFLET_API } from '_platform/api';
import './Register.css';
const Step = Steps.Step;

export default class RiskModle extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentStep: ''
        };
    }
    componentDidMount () {
        this.initMap();
    }

    getRiskState (status) {
        switch (status) {
            case -1:
                return '确认中';
            case 0:
                return '整改中';
            case 1:
                return '审核中';
            case 2:
                return '完成';
            case '确认中':
                return -1;
            case '整改中':
                return 0;
            case '审核中':
                return 1;
            case '完成':
                return 2;
            default:
                return '确认中';
        }
    }

    // 请求地图链接
    subDomains = ['7'];
    /* 初始化地图 */
    initMap () {
        this.map = L.map('mapid', INITLEAFLET_API);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.tileLayer = L.tileLayer(TILEURLS[1], {
            attribution: '&copy;<a href="">ecidi</a>',
            id: 'tiandi-map',
            subdomains: this.subDomains
        }).addTo(this.map);
        // 航拍影像
        if (CUS_TILEMAP) { L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map); }

        L.tileLayer.wms(WMSTILELAYERURL, {
            subdomains: this.subDomains
        }).addTo(this.map);
    }

    /* 在地图上添加marker和polygan */
    createMarker () {
        let geo = this.props.dataSous;
        if (!geo.geometry.coordinates[0] || !geo.geometry.coordinates[1]) {
            return;
        }
        let dangerIcon = L.icon({ iconUrl: require('./ImageIcon/danger.png') });
        let marker = L.marker(geo.geometry.coordinates, { icon: dangerIcon, title: geo.riskContent });
        console.log('marker', marker);
        marker.bindPopup(L.popup({ maxWidth: 240 }).setContent(this.genPopUpContent(geo)));
        marker.addTo(this.map);
        return marker;
        // let dangerIcon = L.icon({iconUrl: require('./ImageIcon/danger.png')});
        // L.marker([22.5202031353,113.893730454],{icon: dangerIcon}).addTo(this.map)
    }

    genPopUpContent (geo) {
        return (
            `<div>
                <h2><span>隐患内容：</span>${geo.riskContent}</h2>
                <h2><span>风险级别：</span>${geo.level}</h2>
                <h2><span>整改状态：</span>未整改</h2>
                <h2><span>整改措施：</span>${geo.zgcuoshi ? geo.zgcuoshi : ''}</h2>
            </div>`
        );
    }

    render () {
        let detail = this.props.dataSous;
        console.log('detail', detail);
        this.state.currentStep = this.getRiskState(detail.status);
        return (
            <Modal
                visible
                footer={false}
                width={1000}
                onCancel={this.props.oncancel}
            >
                <Row><h2 style={{ textAlign: 'center' }}>不文明施工详情</h2></Row>
                <Row style={{ marginTop: 15 }}>
                    <Col span={8}><span style={{ fontSize: 16 }}>{`不文明施工内容：${detail.problemType}`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`发现人员：${detail.fsPeople}`}</span></Col>
                </Row>
                <Row>
                    <Col span={16}><span style={{ fontSize: 16 }}>{`单位工程：${detail.unitName}`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`监理工程师：${detail.jlPeople}`}</span></Col>
                </Row>
                <Row>
                    <Col span={8}><span style={{ fontSize: 16 }}>{`整改措施：${detail.zgcuoshi}`}</span></Col>
                    <Col span={6} style={{ float: 'right' }}><span style={{ fontSize: 16 }}>{`整改负责人：${detail.resPeople}`}</span></Col>
                </Row>
                <Row style={{ marginTop: 30 }}>
                    <Steps current={this.state.currentStep + 2} >
                        <Step title='发起' />
                        <Step title='确认' />
                        <Step title='整改' />
                        <Step title='审核' />
                    </Steps>
                </Row>
                <Row style={{ marginTop: 50 }}>
                    <Button style={{ marginRight: '10px' }} onClick={this.createMarker.bind(this)}>位置</Button>
                </Row>
                <Card style={{ height: 500, width: '100%' }}>
                    <div id='mapid' style={{
                        'position': 'absolute',
                        'top': 0,
                        'bottom': 0,
                        'left': 0,
                        'right': 0,
                        'borderLeft': '1px solid #ccc'
                    }} />
                </Card>
            </Modal>
        );
    }
}
