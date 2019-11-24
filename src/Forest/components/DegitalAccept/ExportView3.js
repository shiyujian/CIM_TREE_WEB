import React, { Component } from 'react';
import { Spin, Modal, Row, Button, Tabs, Notification } from 'antd';
import L from 'leaflet';
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
import { lineString, buffer } from '@turf/turf';
const { TabPane } = Tabs;
export default class ExportView3 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            leader: '',
            unitName: '',
            detail: '',
            buffered: '',
            tabKey: 0
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            itemDetailList = []
        } = this.props;
        console.log('itemDetailList', itemDetailList);
        if (itemDetailList.length > 0) {
            let detail = itemDetailList[0];
            await this.initMap(detail);
            console.log('detail', detail);
            await this.getRouteLayer(detail);
            this.setState({
                detail
            });
        }
    }
    /* 初始化地图 */
    initMap = async (detail) => {
        try {
            if (this.map) {
                await this.map.off();
                await this.map.remove();
            }
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            mapInitialization.attributionControl = false;
            this.map = L.map(`${detail.ID}`, mapInitialization);

            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [1, 2, 3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [1, 2, 3],
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    getRouteLayer = async (detail) => {
        console.log('detail', detail);
        if (detail && detail.Section && detail.ThinClass) {
            await this._addAreaLayer(detail.ThinClass, detail.Section);
        }
        detail.Geom && await this.area(wktToJson(detail.Geom));
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, section) => {
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let coordsList = await handleAreaLayerData(eventKey, getTreearea, section);
            if (coordsList && coordsList instanceof Array && coordsList.length > 0) {
                for (let t = 0; t < coordsList.length; t++) {
                    let coords = coordsList[t];
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
    area (points) {
        if (points && points instanceof Array && points.length > 1) {
            let latlngs = [];
            let lnglats = [];
            for (let i = 0; i < points.length; i++) {
                latlngs.push([points[i].Y, points[i].X]);
                lnglats.push([points[i].X, points[i].Y]);
            }
            let beginIcon = L.icon({
                iconUrl: require('./img/start.png'),
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            let endIcon = L.icon({
                iconUrl: require('./img/end.png'),
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            console.log('beginIcon', beginIcon);
            L.marker(latlngs[0], {
                icon: beginIcon,
                zIndexOffset: -50
            }).addTo(this.map);
            L.marker(latlngs[latlngs.length - 1], {
                icon: endIcon,
                zIndexOffset: -50
            }).addTo(this.map);

            let linestring1 = lineString(lnglats, { name: 'line 1' });
            console.log('linestring1', linestring1);
            let buffered = buffer(linestring1, 0.005, { units: 'kilometers' });
            console.log('buffered', buffered);
            L.geoJSON(buffered, {
                style: function (feature) {
                    return {
                        color: 'red'
                    };
                }
            }).addTo(this.map);
            this.map.panTo(latlngs[0]);
            this.setState({
                buffered
            });
        }
    }
    handleExport = async () => {
        const {
            buffered,
            detail
        } = this.state;
        const {
            actions: {
                postMapImage
            }
        } = this.props;
        if (buffered && buffered.geometry && buffered.geometry.coordinates) {
            this.setState({
                loading: true
            });
            let coordinates = buffered.geometry.coordinates;
            let wkt = JSON.stringify(coordinates);
            let center = this.map.getCenter();
            let zoom = this.map.getZoom();
            let postData = {
                WKT: wkt,
                Width: 550,
                Height: 350,
                Level: zoom,
                X: center.lng,
                Y: center.lat,
                Section: detail.Section,
                ThinClass: detail.ThinClass
            };
            let data = await postMapImage({}, postData);
            if (data && data.indexOf('png') !== -1) {
                let downloadUrl = `${DOCEXPORT_API}?action=acceptance&acceptancedetailid=${detail.ID}&mapimage=${data}`;
                await this.createLink(this, downloadUrl);
                this.props.onPressOk();
            } else {
                Notification.error({
                    message: '无法获取样带数据，请重新获取',
                    duration: 3
                });
                this.setState({
                    loading: false
                });
            }
        } else {
            Notification.error({
                message: '无法获取样带数据，请重新获取',
                duration: 3
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
    tabChange = async (key) => {
        const {
            itemDetailList = []
        } = this.props;
        let detail = itemDetailList[key];
        await this.initMap(detail);
        await this.getRouteLayer(detail);

        this.setState({
            detail
        });
    }
    render () {
        const {
            loading
        } = this.state;
        const {
            itemDetailList = []
        } = this.props;
        return (

            <Modal
                width={598}
                visible
                title='挖穴质量验收样带'
                maskClosable={false}
                onCancel={this.handleCancel.bind(this)}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Tabs defaultActiveKey='0' onChange={this.tabChange.bind(this)}>
                        {
                            itemDetailList.map((item, index) => {
                                return (
                                    <TabPane
                                        tab={(item && item.TreeTypeObj && item.TreeTypeObj.TreeTypeName) || '树种'}
                                        key={index}>
                                        <div>
                                            <p>请在地图设置所要导出的样带视图</p>
                                            <div
                                                id={item.ID}
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
                                    </TabPane>
                                );
                            })
                        }
                    </Tabs>
                </Spin>
            </Modal>

        );
    }
}
