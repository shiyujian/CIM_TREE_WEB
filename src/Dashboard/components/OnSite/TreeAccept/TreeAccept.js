import React, { Component } from 'react';
import { Button } from 'antd';
import L from 'leaflet';
import './TreeAccept.less';
import {
    computeSignedArea
} from '_platform/gisAuth';

export default class TreeAccept extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            coordinates: [], // 地图圈选
            polygonData: '', // 圈选地图图层
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false // 面积数据显示
        };
    }
    componentDidMount = async () => {
        const {
            map
        } = this.props;
        try {
            console.log('aaaaaaaaa');
            await map.on('click', this.handleTreeAcceptClickFunction);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.off('click', this.handleTreeAcceptClickFunction);
            await this.handleCloseMeasureMenu();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleTreeAcceptClickFunction = async (e) => {
        const {
            coordinates = []
        } = this.state;
        const {
            map
        } = this.props;
        // 测量面积
        coordinates.push([e.latlng.lat, e.latlng.lng]);
        if (this.state.polygonData) {
            map.removeLayer(this.state.polygonData);
        }
        let polygonData = L.polygon(coordinates, {
            color: 'white',
            fillColor: '#93B9F2',
            fillOpacity: 0.2
        }).addTo(map);
        this.setState({
            coordinates,
            polygonData: polygonData
        });
    }
    render () {
        const {
            coordinates,
            areaMeasure,
            areaMeasureVisible
        } = this.state;
        // 计算面积的确定按钮是否可以点击，如果不形成封闭区域，不能点击
        let createAreaMeasureOkDisplay = false;
        if (coordinates.length <= 2) {
            createAreaMeasureOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createAreaMeasureBackDisplay = false;
        if (coordinates.length <= 0) {
            createAreaMeasureBackDisplay = true;
        }
        return (
            <div>
                <div className='TreeAccept-editPolygonLayout'>
                    <div>
                        <Button type='primary' style={{marginRight: 10}}
                            disabled={createAreaMeasureOkDisplay}
                            onClick={this._handleCreateMeasureOk.bind(this)}>
                                    确定
                        </Button>
                        <Button type='default' style={{marginRight: 10}}
                            disabled={createAreaMeasureBackDisplay}
                            onClick={this._handleCreateMeasureRetreat.bind(this)}>
                                    上一步
                        </Button>
                        <Button type='danger'
                            onClick={this.handleCloseMeasureMenu.bind(this)}>
                                    撤销
                        </Button>
                    </div>
                </div>
                { // 显示面积
                    areaMeasureVisible ? (
                        <div className='TreeAccept-areaMeasureLayout'>
                            <span>{`面积：${areaMeasure} 亩`}</span>
                        </div>
                    ) : ''
                }
            </div>
        );
    }

    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            map
        } = this.props;
        const {
            polygonData
        } = this.state;
        // 去除框选地图的面积图层
        if (polygonData) {
            map.removeLayer(polygonData);
        }
        this.setState({
            coordinates: [],
            polygonData: '',
            areaMeasure: 0,
            areaMeasureVisible: false
        });
    }

    // 计算圈选区域面积
    _handleCreateMeasureOk = async () => {
        const {
            coordinates
        } = this.state;
        const {
            areaEventKey
        } = this.props;
        try {
            console.log('areaEventKey', areaEventKey);
            let areaMeasure = computeSignedArea(coordinates, 2);
            areaMeasure = (areaMeasure * 0.0015).toFixed(2);
            this.setState({
                areaMeasure,
                areaMeasureVisible: true
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    // 圈选地图后退
    _handleCreateMeasureRetreat = async () => {
        const {
            coordinates
        } = this.state;
        const {
            map
        } = this.props;
        // 计算面积
        if (this.state.polygonData) {
            map.removeLayer(this.state.polygonData);
        }
        this.setState({
            areaMeasureVisible: false
        });
        coordinates.pop();
        let polygonData = L.polygon(coordinates, {
            color: 'white',
            fillColor: '#93B9F2',
            fillOpacity: 0.2
        }).addTo(map);
        this.setState({
            coordinates,
            polygonData: polygonData
        });
    }
}
