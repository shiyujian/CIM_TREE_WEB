import React, { Component } from 'react';
import { Radio } from 'antd';
import L from 'leaflet';
import { WMSTILELAYERURL, TILEURLS, INITLEAFLET_API } from '_platform/api';
import './ProjectImageGis.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export default class ProjectImageGis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            menuWidth: 200 /* 菜单宽度 */,
            isTwoScreenShow: 1
        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
        this.imgTileLayer = null;
        this.cvaTileLayer = null;
        this.map = null;
        this.map2 = null;
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500
        };
    }

    tileUrls = {
        1: window.config.IMG_1,
        2: window.config.IMG_2,
        3: window.config.IMG_3,
        4: window.config.IMG_4,
        5: window.config.IMG_5,
        6: window.config.IMG_6,
        7: window.config.IMG_7
    };

    async componentDidMount () {
        try {
            await this.initMap();
            await this.initMap2();
            // 地图联动
            const maps = [this.map, this.map2];
            // 事件
            function maplink (e) {
                let _this = this;
                maps.map(function (t) {
                    t.setView(_this.getCenter(), _this.getZoom());
                });
            }
            // 绑定
            maps.map(function (t) {
                t.on({ drag: maplink, zoom: maplink });
            });
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    /* 初始化地图 */
    initMap () {
        let mapInitialization = INITLEAFLET_API;
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map = L.map('mapid', mapInitialization);

        this.imgTileLayer = L.tileLayer(TILEURLS[1], {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);

        this.cvaTileLayer = L.tileLayer(`${WMSTILELAYERURL}`, {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 15,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map);
    }
    initMap2 () {
        let mapInitialization = INITLEAFLET_API;
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map2 = L.map('mapid2', mapInitialization);

        this.imgTileLayer = L.tileLayer(TILEURLS[1], {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map2);

        this.cvaTileLayer = L.tileLayer(`${WMSTILELAYERURL}`, {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map2);

        this.tileTreeLayerBasic = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 15,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map2);
    }
    render () {
        return (
            <div className='ProjectImageGis-container'>
                <div
                    className='ProjectImageGis-map ProjectImageGis-r-main'
                >
                    <div className='ProjectImageGis-treeControlLeft' style={{ zIndex: 888 }}>
                        <div>
                            <RadioGroup
                                defaultValue={1}
                                onChange={this.toggleTileLayer.bind(this)}
                                size='small'
                            >
                                <RadioButton value={1} style={{marginRight: 2}}>
                                    2017-11-15
                                </RadioButton>
                                <RadioButton value={2} style={{marginRight: 2}}>
                                    2017-11-24
                                </RadioButton>
                                <RadioButton value={3} style={{marginRight: 2}}>
                                    2017-12-01
                                </RadioButton>
                                <RadioButton value={4} style={{marginRight: 2}}>
                                    2017-12-10
                                </RadioButton>
                                <RadioButton value={5} style={{marginRight: 2}}>
                                    2017-12-13
                                </RadioButton>
                                <RadioButton value={6} style={{marginRight: 2}}>
                                    2018-3-23
                                </RadioButton>
                                <RadioButton value={7} style={{marginRight: 2}}>
                                    2018-5-4
                                </RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className='ProjectImageGis-treeControlRight' style={{ zIndex: 888 }}>
                        <div>
                            <RadioGroup
                                defaultValue={1}
                                onChange={this.toggleTileLayer2.bind(this)}
                                size='small'
                            >
                                <RadioButton value={1} style={{marginRight: 2}}>
                                    2017-11-15
                                </RadioButton>
                                <RadioButton value={2} style={{marginRight: 2}}>
                                    2017-11-24
                                </RadioButton>
                                <RadioButton value={3} style={{marginRight: 2}}>
                                    2017-12-01
                                </RadioButton>
                                <RadioButton value={4} style={{marginRight: 2}}>
                                    2017-12-10
                                </RadioButton>
                                <RadioButton value={5} style={{marginRight: 2}}>
                                    2017-12-13
                                </RadioButton>
                                <RadioButton value={6} style={{marginRight: 2}}>
                                    2018-3-23
                                </RadioButton>
                                <RadioButton value={7} style={{marginRight: 2}}>
                                    2018-5-4
                                </RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        <div
                            id='mapid'
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                borderLeft: '1px solid #ccc',
                                float: 'left',
                                width: '50%'
                            }}
                        />
                        <div
                            id='mapid2'
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: '50%',
                                right: 0,
                                borderLeft: '1px solid #ccc',
                                float: 'right',
                                width: '50%'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
    // 切换
    toggleTileLayer (e) {
        const index = e.target.value;
        this.tileLayer.setUrl(this.tileUrls[index]);
    }
    toggleTileLayer2 (e) {
        const index = e.target.value;
        this.tileTreeLayerBasic.setUrl(this.tileUrls[index]);
    }
}
