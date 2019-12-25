import React, { Component } from 'react';
import { Spin, Modal, Row, Button, Tabs, Notification } from 'antd';
import L from 'leaflet';
import wellknown from 'wellknown';
import './index.less';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API,
    DOCEXPORT_API
} from '_platform/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates,
    wktToJson
} from './auth';
import {
    handleMULTIPOLYGONLatLngToLngLat,
    handlePOLYGONWktData
} from '_platform/gisAuth';
import { lineString, buffer } from '@turf/turf';
const { TabPane } = Tabs;
export default class ExportView10 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            leader: '',
            unitName: '',
            tableData: []
        };
        this.map = null;
    }

    componentDidMount = async () => {
        const {
            itemDetail = {}
        } = this.props;
        await this.initMap();
        if (itemDetail && itemDetail.ID) {
            await this._addAreaLayer(itemDetail);
        }
    }
    /* 初始化地图 */
    initMap () {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            this.map = L.map('mapid', mapInitialization);
            // 加载基础图层
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [3],
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (itemDetail) => {
        try {
            let wkt = itemDetail.Coords;
            // let wkt = 'MULTIPOLYGON(((115.83155564032495 39.08126609399915,115.83204799331725 39.081295765936375,115.83198085427284 39.08180505037308,115.83184431307018 39.08257031813264,115.8313353639096 39.08246353268623,115.83155564032495 39.08126609399915)),((115.83157064393163 39.08120423555374,115.83163233473897 39.0811650082469,115.83195294253528 39.08118311315775,115.83199535496533 39.08123390749097,115.83157064393163 39.08120423555374)),((115.83214203827083 39.081244468688965,115.8320972789079 39.081190656870604,115.83373493514955 39.081281181424856,115.83365849219263 39.0813515894115,115.83214203827083 39.081244468688965)))';
            console.log('wkt', wkt);
            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let coords = wellknown.parse(wkt);
                console.log('coords', coords);
                if (coords.coordinates) {
                    let coordinates = handleMULTIPOLYGONLatLngToLngLat(coords.coordinates);
                    coords.coordinates = coordinates;
                }
                let message = {
                    key: 3,
                    type: 'Feature',
                    properties: {name: '', type: 'area'},
                    geometry: coords
                };
                let layer = this._createMarker(message);
                this.map.fitBounds(layer.getBounds());
            } else {
                let str = handlePOLYGONWktData(wkt);
                let coords = [];
                coords.push(str);
                if (coords && coords instanceof Array && coords.length > 0) {
                    for (let i = 0; i < coords.length; i++) {
                        let str = coords[i];
                        let treearea = handleCoordinates(str);
                        let message = {
                            key: 3,
                            type: 'Feature',
                            properties: {name: '', type: 'area'},
                            geometry: { type: 'Polygon', coordinates: treearea }
                        };
                        let layer = this._createMarker(message);
                        if (i === coords.length - 1) {
                            this.map.fitBounds(layer.getBounds());
                        }
                    }
                };
            }
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            }
        } catch (e) {
            console.log('_createMarker', e);
        }
    }
    handleExport = async () => {
        const {
            actions: {
                postAreaAcceptanceMapImage
            },
            itemDetail,
            record
        } = this.props;
        this.setState({
            loading: true
        });
        let wkt = itemDetail.Coords;
        let center = this.map.getCenter();
        let zoom = this.map.getZoom();
        let postData = {
            WKT: wkt,
            Width: 550,
            Height: 350,
            Level: zoom,
            X: center.lng,
            Y: center.lat,
            Section: itemDetail.Section,
            ThinClass: itemDetail.ThinClass
        };
        let data = await postAreaAcceptanceMapImage({}, postData);
        console.log('data', data);

        if (data && data.indexOf('png') !== -1) {
            let downloadUrl = `${DOCEXPORT_API}?action=areaacceptance&id=${record.ID}&mapimage=${data}`;
            await this.createLink(this, downloadUrl);
            this.props.onPressOk();
        } else {
            Notification.error({
                message: '无法获取细班数据，请重新获取',
                duration: 3
            });
            this.setState({
                loading: false
            });
        }
    }
    createLink = async (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.download = name;
        link.href = url;
        await link.setAttribute('download', this);
        await link.setAttribute('target', '_blank');
        await document.body.appendChild(link);
        await link.click();
        await document.body.removeChild(link);
    };
    handleCancel = () => {
        this.props.onPressOk();
    }
    render () {
        const {
            loading
        } = this.state;
        const {
            itemDetail = {}
        } = this.props;
        return (

            <Modal
                width={598}
                visible
                title='造林面积验收地图'
                maskClosable={false}
                onCancel={this.handleCancel.bind(this)}
                footer={null}
            >
                <Spin spinning={loading}>
                    <div>
                        <p>请在地图设置所要导出的视图</p>
                        <div
                            id={'mapid'}
                            style={{
                                height: 350,
                                borderLeft: '1px solid #ccc',
                                // position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0
                            }}
                        />
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.handleExport.bind(this)}
                                style={{ float: 'right', marginLeft: 10 }}
                                type='primary'
                            >
                                导出
                            </Button>
                            <Button
                                onClick={this.handleCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Spin>
            </Modal>

        );
    }
}
