import React, { Component } from 'react';
import { Button } from 'antd';
import L from 'leaflet';
import 'leaflet-editable';
import './AreaDistanceMeasure.less';
import distanceMeasureUnSelImg from './MeasureImg/距离测量2.png';
import distanceMeasureSelImg from './MeasureImg/距离测量3.png';
import areaMeasureUnSelImg from './MeasureImg/面积测量2.png';
import areaMeasureSelImg from './MeasureImg/面积测量3.png';
import {
    computeSignedArea,
    handlePolygonLatLngs,
    handlePolylineLatLngs
} from '_platform/gisAuth';

export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            totalDistanceMeasure: 0, // 总距离
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false, // 面积数据显示
            distanceMeasureNumList: []
        };
        this.editPolygon = '';
        this.editPolyline = '';
        this.distanceMeasureMarkerList = {};
    }
    componentDidMount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.on('mouseup', this.handleMapMeasureClickFunction);
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
            await map.off('mouseup', this.handleMapMeasureClickFunction);
            await map.off('click', this.handleMapMeasureClickFunction);

            await this.handleCloseMeasureMenu();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleMapMeasureClickFunction = async (e) => {
        const {
            areaDistanceMeasureMenu,
            map
        } = this.props;
        // 测量面积
        if (areaDistanceMeasureMenu === 'areaMeasureMenu') {
            if (this.editPolygon) {
                let coordinates = handlePolygonLatLngs(this.editPolygon);
                console.log('coordinates', coordinates);
                if (coordinates.length > 2) {
                    let areaMeasure = computeSignedArea(coordinates, 2);
                    areaMeasure = (areaMeasure * 0.0015).toFixed(2);
                    this.setState({
                        areaMeasure,
                        areaMeasureVisible: true
                    });
                }
            }
        } else if (areaDistanceMeasureMenu === 'distanceMeasureMenu') {
            let coordinates = [];
            if (this.editPolyline) {
                coordinates = handlePolylineLatLngs(this.editPolyline);
                console.log('coordinates', coordinates);
            }
            // 测量距离
            // 如果数据已经存在两个了，则计算最新点击的点和前一个点的距离
            let distanceMeasureNumList = [];
            if (coordinates.length > 1) {
                await this.handleRemoveDistanceMeasureMarker();
                for (let i = 1; i < coordinates.length; i++) {
                    let distanceMeasure = 0;
                    let latlng = L.latLng(coordinates[i - 1]);
                    // 计算前一个点与当前点的距离
                    distanceMeasure = latlng.distanceTo(L.latLng(coordinates[i])).toFixed(2);
                    // 将计算的距离加载在地图上  两点中间
                    let iconType = L.divIcon({
                        html: `${distanceMeasure}`,
                        className: 'dashboard-distanceMeasure-icon',
                        iconSize: 'auto'
                    });
                    let dataX = (coordinates[i - 1][0] + coordinates[i][0]) / 2;
                    let dataY = (coordinates[i - 1][1] + coordinates[i][1]) / 2;
                    let marker = L.marker([dataX, dataY], {
                        icon: iconType
                    });
                    marker.addTo(map);
                    // 将两点之间的marker图层保存起来
                    this.distanceMeasureMarkerList[i] = marker;
                    if (distanceMeasure) {
                        distanceMeasureNumList.push(distanceMeasure);
                    }
                }
            }
            let totalDistanceMeasure = 0;
            distanceMeasureNumList.map((distance) => {
                totalDistanceMeasure = (Number(totalDistanceMeasure) +
                    Number(distance) + 0).toFixed(2);
            });
            this.setState({
                totalDistanceMeasure,
                distanceMeasureNumList
            });
        }
    }

    handleRemoveDistanceMeasureMarker = () => {
        const {
            map
        } = this.props;
        console.log('this.distanceMeasureMarkerList', Object.keys(this.distanceMeasureMarkerList).length);

        // 去除距离测量的显示的距离图层
        for (let i in this.distanceMeasureMarkerList) {
            console.log('iiiii', i);
            console.log('ddddddddddd', this.distanceMeasureMarkerList[i]);

            map.removeLayer(this.distanceMeasureMarkerList[i]);
        }
    }

    // 选择是测量面积还是距离
    handleSwitchMeasureMenu = async (type) => {
        const {
            actions: {
                switchAreaDistanceMeasureMenu
            },
            areaDistanceMeasureMenu,
            map
        } = this.props;
        console.log('areaDistanceMeasureMenu', areaDistanceMeasureMenu);
        console.log('type', type);

        if (areaDistanceMeasureMenu !== type) {
            await this.handleCloseMeasureMenu();
            await switchAreaDistanceMeasureMenu(type);
            if (type === 'distanceMeasureMenu') {
                // 重新开始框选图层
                this.editPolyline = map.editTools.startPolyline();
            } else if (type === 'areaMeasureMenu') {
                // 重新开始框选图层
                this.editPolygon = map.editTools.startPolygon();
            }
        }
    }

    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            map
        } = this.props;
        // 去除距离测量图层
        if (this.editPolyline) {
            map.removeLayer(this.editPolyline);
            map.editTools.stopDrawing();
        }
        this.editPolyline = '';
        // 去除面积测量图层
        if (this.editPolygon) {
            map.removeLayer(this.editPolygon);
            map.editTools.stopDrawing();
        }
        this.editPolygon = '';
        // 去除距离测量的显示的距离图层
        for (let i in this.distanceMeasureMarkerList) {
            map.removeLayer(this.distanceMeasureMarkerList[i]);
        }
        this.setState({
            areaMeasure: 0,
            areaMeasureVisible: false,
            totalDistanceMeasure: 0,
            distanceMeasureNumList: []
        });
    }

    render () {
        const {
            areaDistanceMeasureMenu
        } = this.props;
        const {
            areaMeasure,
            areaMeasureVisible,
            totalDistanceMeasure
        } = this.state;
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
                <div className='AreaDistanceMeasure-measureNumLayout'>
                    <span className='AreaDistanceMeasure-measureNumText'>
                        {
                            areaMeasureVisible
                                ? `面积：${areaMeasure} 亩`
                                : (
                                    totalDistanceMeasure
                                        ? `总距离：${totalDistanceMeasure} 米`
                                        : ''
                                )
                        }
                    </span>
                </div>
            </div>
        );
    }
}
