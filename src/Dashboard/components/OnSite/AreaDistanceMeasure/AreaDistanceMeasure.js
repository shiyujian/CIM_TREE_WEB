import React, { Component } from 'react';
import { Button } from 'antd';
import './AreaDistanceMeasure.less';
import distanceMeasureUnSelImg from '../../MeasureImg/distanceUnSel.png';
import distanceMeasureSelImg from '../../MeasureImg/distanceSel.png';
import areaMeasureUnSelImg from '../../MeasureImg/areaUnSel.png';
import areaMeasureSelImg from '../../MeasureImg/areaSel.png';
import {
    computeSignedArea
} from '_platform/gisAuth';

export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            coordinates: [], // 地图圈选
            polygonData: '', // 圈选地图图层
            totalDistanceMeasure: 0, // 总距离
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false, // 面积数据显示
            distanceMeasureMarkerList: {},
            distanceMeasureLineList: {},
            distanceMeasureNumList: []
        };
    }
    componentDidMount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.on('click', this.handleMapMeasureClickFunction);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.off('click', this.handleMapMeasureClickFunction);
            await this.handleCloseMeasureMenu();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleMapMeasureClickFunction = async (e) => {
        const {
            coordinates = [],
            distanceMeasureMarkerList = {},
            distanceMeasureLineList = {},
            distanceMeasureNumList = []
        } = this.state;
        const {
            areaDistanceMeasureMenu,
            map
        } = this.props;
        // 测量面积
        if (areaDistanceMeasureMenu === 'areaMeasureMenu') {
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            if (this.state.polygonData) {
                map.removeLayer(this.state.polygonData);
            }
            console.log('coordinates', coordinates);
            let polygonData = L.polygon(coordinates, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(map);
            this.setState({
                coordinates,
                polygonData: polygonData
            });
        } else if (areaDistanceMeasureMenu === 'distanceMeasureMenu') {
            // 测量距离
            // 如果数据已经存在两个了，则计算最新点击的点和前一个点的距离
            let distanceMeasure = 0;
            let lineData = [];
            if (coordinates.length > 1) {
                coordinates.push([e.latlng.lat, e.latlng.lng]);
                let latlng = L.latLng(coordinates[coordinates.length - 2]);
                // 计算前一个点与当前点的距离
                distanceMeasure = latlng.distanceTo(L.latLng(coordinates[coordinates.length - 1])).toFixed(2);
                // 将计算的距离加载在地图上  两点中间
                let iconType = L.divIcon({
                    html: `${distanceMeasure}`,
                    className: 'dashboard-distanceMeasure-icon',
                    iconSize: 'auto'
                });
                let dataX = (coordinates[coordinates.length - 2][0] + e.latlng.lat) / 2;
                let dataY = (coordinates[coordinates.length - 2][1] + e.latlng.lng) / 2;
                let marker = L.marker([dataX, dataY], {
                    icon: iconType
                });
                marker.addTo(map);
                // 将两点之间的marker图层保存起来
                let markerId = `${e.latlng.lat}, ${e.latlng.lng}`;
                distanceMeasureMarkerList[markerId] = marker;
                // 设置直线数据
                lineData.push(coordinates[coordinates.length - 2]);
                lineData.push(coordinates[coordinates.length - 1]);
            } else if (coordinates.length === 1) {
                // 如果数据已经存在一个，则计算最新点击的点和当前点的距离
                coordinates.push([e.latlng.lat, e.latlng.lng]);
                let latlng = L.latLng(coordinates[0]);
                // 计算前一个点与当前点的距离
                distanceMeasure = latlng.distanceTo(L.latLng(coordinates[1])).toFixed(2);
                // 将计算的距离加载在地图上  两点中间
                let iconType = L.divIcon({
                    html: `${distanceMeasure}`,
                    className: 'dashboard-distanceMeasure-icon',
                    iconSize: 'auto'
                });
                let dataX = (coordinates[coordinates.length - 2][0] + e.latlng.lat) / 2;
                let dataY = (coordinates[coordinates.length - 2][1] + e.latlng.lng) / 2;
                let marker = L.marker([dataX, dataY], {
                    icon: iconType
                });
                marker.addTo(map);
                // 将两点之间的marker图层保存起来
                let markerId = `${e.latlng.lat}, ${e.latlng.lng}`;
                distanceMeasureMarkerList[markerId] = marker;
                // 设置直线数据
                lineData.push(coordinates[coordinates.length - 2]);
                lineData.push(coordinates[coordinates.length - 1]);
            } else if (coordinates.length === 0) {
                // 如果数据不存在，则不计算距离
                coordinates.push([e.latlng.lat, e.latlng.lng]);
                lineData.push([e.latlng.lat, e.latlng.lng]);
            }

            if (distanceMeasure) {
                distanceMeasureNumList.push(distanceMeasure);
            }
            let totalDistanceMeasure = 0;
            distanceMeasureNumList.map((distance) => {
                totalDistanceMeasure = (Number(totalDistanceMeasure) +
                    Number(distance) + 0).toFixed(2);
            });
            let polygonData = L.polygon(lineData, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(map);
            let lineID = `${e.latlng.lat}, ${e.latlng.lng}`;
            distanceMeasureLineList[lineID] = polygonData;
            this.setState({
                coordinates,
                distanceMeasureLineList,
                totalDistanceMeasure,
                distanceMeasureMarkerList,
                distanceMeasureNumList
            });
        }
    }
    render () {
        const {
            areaDistanceMeasureMenu
        } = this.props;
        const {
            coordinates,
            areaMeasure,
            areaMeasureVisible,
            totalDistanceMeasure,
            distanceMeasureLineList
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

        // 计算距离的上一步按钮是否可以点击，如果没有点，不能点击
        let createDistanceMeasureBackDisplay = false;
        if (Object.keys(distanceMeasureLineList).length <= 0) {
            createDistanceMeasureBackDisplay = true;
        }
        return (
            <div>
                <div className='AreaDistanceMeasure-rightDataMeasureMenu'>
                    <aside className='AreaDistanceMeasure-rightDataMeasureMenu-aside' draggable='false'>
                        <div>
                            <div className={areaDistanceMeasureMenu === 'distanceMeasureMenu' ? 'AreaDistanceMeasure-rightDataMeasureMenu-back-Select' : 'AreaDistanceMeasure-rightDataMeasureMenu-back-Unselect'}>
                                <img src={areaDistanceMeasureMenu === 'distanceMeasureMenu' ? distanceMeasureSelImg : distanceMeasureUnSelImg}
                                    onClick={this.handleSwitchMeasureMenu.bind(this, 'distanceMeasureMenu')}
                                    title='距离计算'
                                    className='AreaDistanceMeasure-rightDataMeasureMenu-clickImg' />
                            </div>
                            <div className={areaDistanceMeasureMenu === 'areaMeasureMenu' ? 'AreaDistanceMeasure-rightDataMeasureMenu-back-Select' : 'AreaDistanceMeasure-rightDataMeasureMenu-back-Unselect'}>
                                <img src={areaDistanceMeasureMenu === 'areaMeasureMenu' ? areaMeasureSelImg : areaMeasureUnSelImg}
                                    onClick={this.handleSwitchMeasureMenu.bind(this, 'areaMeasureMenu')}
                                    title='面积计算'
                                    className='AreaDistanceMeasure-rightDataMeasureMenu-clickImg' />
                            </div>
                        </div>
                    </aside>
                </div>
                { // 框选面积的画图按钮
                    areaDistanceMeasureMenu === 'areaMeasureMenu' ? (
                        <div className='AreaDistanceMeasure-editPolygonLayout'>
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
                    ) : ''
                }
                { // 显示面积
                    areaMeasureVisible ? (
                        <div className='AreaDistanceMeasure-areaMeasureLayout'>
                            <span>{`面积：${areaMeasure} 亩`}</span>
                        </div>
                    ) : ''
                }
                { // 选择测量距离的画图按钮
                    areaDistanceMeasureMenu === 'distanceMeasureMenu' ? (
                        <div className='AreaDistanceMeasure-editPolygonLayout'>
                            <div>
                                <Button type='default' style={{marginRight: 10}}
                                    disabled={createDistanceMeasureBackDisplay}
                                    onClick={this._handleCreateMeasureRetreat.bind(this)}>
                                    上一步
                                </Button>
                                <Button type='danger'
                                    onClick={this.handleCloseMeasureMenu.bind(this)}>
                                    撤销
                                </Button>
                            </div>
                        </div>
                    ) : ''
                }
                { // 显示距离
                    totalDistanceMeasure ? (
                        <div className='AreaDistanceMeasure-areaMeasureLayout'>
                            <span>{`总距离：${totalDistanceMeasure} 米`}</span>
                        </div>
                    ) : ''
                }
            </div>
        );
    }

    // 选择是测量面积还是距离
    handleSwitchMeasureMenu = async (type) => {
        const {
            actions: {
                switchAreaDistanceMeasureMenu
            },
            areaDistanceMeasureMenu
        } = this.props;
        await switchAreaDistanceMeasureMenu(type);
        if (areaDistanceMeasureMenu && areaDistanceMeasureMenu !== type) {
            await this.handleCloseMeasureMenu();
        }
    }

    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            map
        } = this.props;
        const {
            distanceMeasureMarkerList,
            distanceMeasureLineList,
            polygonData
        } = this.state;
        // 去除框选地图的面积图层
        if (polygonData) {
            map.removeLayer(polygonData);
        }
        // 去除距离测量的显示的距离图层
        for (let i in distanceMeasureMarkerList) {
            map.removeLayer(distanceMeasureMarkerList[i]);
        }
        // 去除距离测量的各个直线的图层
        for (let i in distanceMeasureLineList) {
            map.removeLayer(distanceMeasureLineList[i]);
        }
        this.setState({
            coordinates: [],
            polygonData: '',
            areaMeasure: 0,
            areaMeasureVisible: false,
            totalDistanceMeasure: 0,
            distanceMeasureNumList: [],
            distanceMeasureLineList: {},
            distanceMeasureMarkerList: {}
        });
    }

    // 计算圈选区域面积
    _handleCreateMeasureOk = async () => {
        const {
            coordinates
        } = this.state;
        try {
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
            coordinates,
            distanceMeasureMarkerList,
            distanceMeasureLineList,
            distanceMeasureNumList
        } = this.state;
        const {
            areaDistanceMeasureMenu,
            map
        } = this.props;
        // 计算距离
        if (areaDistanceMeasureMenu === 'distanceMeasureMenu') {
            if (Object.keys(distanceMeasureMarkerList).length > 0) {
                map.removeLayer(distanceMeasureMarkerList[Object.keys(distanceMeasureMarkerList)[Object.keys(distanceMeasureMarkerList).length - 1]]);
                delete distanceMeasureMarkerList[Object.keys(distanceMeasureMarkerList)[Object.keys(distanceMeasureMarkerList).length - 1]];
            }
            if (Object.keys(distanceMeasureLineList).length > 0) {
                map.removeLayer(distanceMeasureLineList[Object.keys(distanceMeasureLineList)[Object.keys(distanceMeasureLineList).length - 1]]);
                delete distanceMeasureLineList[Object.keys(distanceMeasureLineList)[Object.keys(distanceMeasureLineList).length - 1]];
            }
            distanceMeasureNumList.pop();
            let totalDistanceMeasure = 0;
            distanceMeasureNumList.map((distance) => {
                totalDistanceMeasure = (Number(totalDistanceMeasure) +
                    Number(distance) + 0).toFixed(2);
            });
            coordinates.pop();
            this.setState({
                distanceMeasureMarkerList,
                distanceMeasureLineList,
                totalDistanceMeasure,
                distanceMeasureNumList,
                coordinates
            });
        } else if (areaDistanceMeasureMenu === 'areaMeasureMenu') {
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
}
