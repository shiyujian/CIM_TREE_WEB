import React, { Component } from 'react';
import { Button, Radio, Modal, Tabs, Table } from 'antd';
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
import CoverageModal from './CoverageModal';
import ImportModal from './ImportModal';
export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            visibleImport: false, // 导入
            polygonEncircle: [], // 面坐标
            radioValue: 1, // 1导入范围 2手动圈画
            totalDistanceMeasure: 0, // 总距离
            areaMeasure: 0, // 圈选区域面积
            coverageVisible: false, // 图层解析
            dataMeasureVisible: false, // 统计数据显示
            areaMeasureVisible: false, // 面积数据显示
            distanceMeasureNumList: []
        };
        this.editPolygon = ''; // 面积图层
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
            } else if (type === 'dataMeasureMenu') {
                // 重新开始框选图层
                this.setState({
                    dataMeasureVisible: true
                });
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
    // 确定
    handleConfirm () {
        const { radioValue } = this.state;
        if (radioValue === 1) {
            this.setState({
                visibleImport: true
            });
        } else if (radioValue === 2) {
            if (this.editPolygon) {
                let coordinates = handlePolygonLatLngs(this.editPolygon);
                console.log('coordinatesshiyujian', coordinates);
                console.log('this.editPolygon', this.editPolygon);
                let WKT = 'POLYGON((';
                coordinates.map(item => {
                    let coord = item[1] + ' ' + item[0];
                    WKT += coord + ',';
                });
                let polygonEncircleWKT = WKT + coordinates[0][1] + ' ' + coordinates[0][0] + '))';
                if (coordinates.length > 2) {
                    this.setState({
                        polygonEncircleWKT: polygonEncircleWKT,
                        polygonEncircle: coordinates,
                        coverageVisible: true
                    });
                }
            }
        }
    }
    // 回退
    handleRollback () {
        if (this.editPolygon) {
            this.editPolygon.editor.pop();
        }
    }
    handleRadio (e) {
        const {
            map
        } = this.props;
        let value = e.target.value;
        if (value === 2) {
            // 手动圈画
            this.editPolygon = map.editTools.startPolygon();
            console.log(this.editPolygon);
        }
        this.setState({
            radioValue: value
        });
    }
    // 撤销
    handleRevocation () {
        const {
            map
        } = this.props;
        // 去除面积测量图层
        if (this.editPolygon) {
            map.removeLayer(this.editPolygon);
            map.editTools.stopDrawing();
            this.editPolygon = map.editTools.startPolygon();
        }
    }
    handleCancelCoverage () {
        this.setState({
            coverageVisible: false
        });
    }
    handleCancelImport () {
        this.setState({
            visibleImport: false
        });
    }

    render () {
        const {
            areaDistanceMeasureMenu
        } = this.props;
        const {
            visibleImport,
            areaMeasure,
            polygonEncircleWKT,
            polygonEncircle,
            dataMeasureVisible,
            areaMeasureVisible,
            coverageVisible,
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
                            <div className={areaDistanceMeasureMenu === 'areaMeasureMenu' ? 'AreaDistanceMeasure-rightDataMeasureMenu-back-Select' : 'AreaDistanceMeasure-rightDataMeasureMenu-back-Unselect'}>
                                <img src={areaDistanceMeasureMenu === 'areaMeasureMenu' ? areaMeasureSelImg : areaMeasureUnSelImg}
                                    onClick={this.handleSwitchMeasureMenu.bind(this, 'dataMeasureMenu')}
                                    title='统计数据'
                                    className='AreaDistanceMeasure-rightDataMeasureMenu-clickImg' />
                            </div>
                        </div>
                    </aside>
                </div>
                {
                    dataMeasureVisible ? <div className='DataDistanceMeasure-measureNumLayout'>
                        <div className='DataDistanceMeasure-btnLayout'>
                            <Button type='primary' onClick={this.handleConfirm.bind(this)}>确定</Button>
                            <Button onClick={this.handleRollback.bind(this)}>上一步</Button>
                            <Button onClick={this.handleRevocation.bind(this)}>撤销</Button>
                        </div>
                        <div className='DataDistanceMeasure-spanLayout'>
                            <span className='AreaDistanceMeasure-measureNumText'>
                                <Radio.Group value={this.state.radioValue} onChange={this.handleRadio.bind(this)}>
                                    <Radio style={{color: '#fff'}} value={1}>导入范围</Radio>
                                    <Radio style={{color: '#fff'}} value={2}>手动圈画</Radio>
                                </Radio.Group>
                            </span>
                        </div>
                    </div> : <div className='AreaDistanceMeasure-measureNumLayout'>
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
                }
                {
                    coverageVisible ? <CoverageModal
                        {...this.props}
                        handleCancel={this.handleCancelCoverage.bind(this)}
                        polygonEncircleWKT={polygonEncircleWKT}
                        polygonEncircle={polygonEncircle}
                        coverageVisible={coverageVisible}
                    /> : ''
                }
                {
                    visibleImport ? <ImportModal
                        {...this.props}
                        handleCancel={this.handleCancelImport.bind(this)}
                        visibleImport={visibleImport}
                    /> : ''
                }
            </div>
        );
    }
}
