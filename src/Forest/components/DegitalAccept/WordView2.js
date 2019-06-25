import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import L from 'leaflet';
import './index.less';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from 'Dashboard/components/auth';
import {
    wktToJson
} from '_platform/gisAuth';
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            areaLayerList: []
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            sscction,
            tinclass,
            detail = {}
        } = this.props;
        await this.initMap();
        this._addAreaLayer(tinclass, sscction);
        detail.Geom && this.area(wktToJson(detail.Geom));
    }

    componentWillUnmount () {
        this.map = null;
    }

    onOk () {
        this.props.onPressOk(2);
    }

    /* 初始化地图 */
    initMap () {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            this.map = L.map('mapid', mapInitialization);
            // 加载基础图层
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
            // 加载苗木图层
            // this.getTileLayerTreeBasic();
            // 加载秋冬季的细班图层
            // this.getTileTreeWinterThinClassLayerBasic();
            // 获取秋冬季的区块范围
            // this.getTileTreeWinterProjectLayerBasic();
        } catch (e) {
            console.log('initMap', e);
        }
    }

    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, section) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let coords = await handleAreaLayerData(eventKey, getTreearea, section);
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
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].push(layer);
                    } else {
                        areaLayerList[eventKey] = [layer];
                    }
                }
                this.setState({
                    areaLayerList
                });
            };
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
        let lineLayer = new L.FeatureGroup().addTo(this.map);
        if (points.length > 1) {
            var latlngs = [];
            var lnglats = [];

            for (var i = 0; i < points.length; i++) {
                latlngs.push([points[i].Y, points[i].X]);
                lnglats.push([points[i].X, points[i].Y]);
            }
            var beginIcon = new L.Icon({
                iconUrl: './img/start.png',
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            var endIcon = new L.Icon({
                iconUrl: './img/end.png',
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            var start = new L.Marker(latlngs[0], {
                icon: beginIcon,
                zIndexOffset: -50
            }).addTo(lineLayer);
            var end = new L.Marker(latlngs[latlngs.length - 1], {
                icon: endIcon,
                zIndexOffset: -50
            }).addTo(lineLayer);
            this.map.fitBounds(lineLayer.getBounds());

            var linestring1 = turf.lineString(lnglats, { name: 'line 1' });
            var buffered = turf.buffer(linestring1, 0.005, { units: 'kilometers' });
            L.geoJSON(buffered, {
                style: function (feature) {
                    return {
                        color: 'red'
                    };
                }
            }).addTo(lineLayer);
        }
    }

    render () {
        const { detail } = this.props;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        let jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        let shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        let xbsjl = detail.DesignNum; // 细班设计量
        let xbsjmj = detail.DesignArea; // 细班设计面积
        let designmd = 1; // 设计密度
        if (xbsjmj !== 0) {
            designmd = xbsjl / xbsjmj;
        }
        let fdsl = detail.LoftingNum; // 放点数量
        let ydmj = detail.SampleTapeArea; // 样带面积
        let truemd = 1; // 实际密度
        let qulityok = '0%'; // 合格率
        let cjsl = detail.CheckNum; // 抽检数量
        let middle = 0;
        if (ydmj !== 0) {
            truemd = fdsl / ydmj;
            middle = cjsl / ydmj;
        }
        qulityok = 1 - middle;
        qulityok = qulityok / designmd;
        qulityok = qulityok * 100;
        qulityok = 100 - qulityok;
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='放样点穴质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>
                        <table style={{ border: 1 }}>
                            <tbody>
                                <table border='1'>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>单位工程名称</td>
                                        <td colSpan='3'> {unit}</td>
                                        <td colSpan='1' width='118px'>细班（小班）</td>
                                        <td colSpan='1'>{`${array[2]}(${array[3]})`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align='center'>施工单位</td>
                                        <td colSpan='3'>中国交建集团</td>
                                        <td >项目经理</td>
                                        <td >王伟</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align='center'>施工员</td>
                                        <td colSpan='1'>{shigong}</td>
                                        <td>设计数量</td>
                                        <td colSpan='1'>{detail.DesignNum}</td>
                                        <td>实际数量</td>
                                        <td >{detail.ActualNum}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' >施工执行标准名称及编号</td>
                                        <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                    </tr>
                                    <tr>
                                        <td colSpan='6' height='200'>
                                            验收要点：以细班或小班为单位，对放样点穴进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带内的点穴精准度、密度情况进行打分。
                                            ①放点精准，抽检密度与设计密度的误差在±10%之内，视为合格，计90分以上，通过检验；
                                            ②放点不准，抽检密度与设计密度的误差超出±10%，即为不合格，需整改。
                                            放样点穴合格率=100-|（1-（抽检数量/样带面积）/设计密度）|*100
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 300 }} colSpan='6'>
                                            <div
                                                id='mapid'
                                                style={{
                                                    height: 300,
                                                    borderLeft: '1px solid #ccc'
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>设计面积</td>
                                        <td colSpan='2'>{detail.DesignArea}</td>
                                        <td colSpan='1' width='118px'>设计密度</td>
                                        <td colSpan='2'>{designmd}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>样带面积</td>
                                        <td colSpan='2'>{detail.SampleTapeArea}</td>
                                        <td colSpan='1' width='118px'>放点数量</td>
                                        <td colSpan='2'>{detail.LoftingNum}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>实际密度</td>
                                        <td colSpan='2'>{truemd}</td>
                                        <td colSpan='1' width='118px'>合格率</td>
                                        <td colSpan='2'>{qulityok}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >施工单位质量专检结果</td>
                                        <td colSpan='5'>
                                            <div>
                                                <p>项目专业质量检查员：</p>
                                                <p className='marL300'>年</p>
                                                <p className='marL30'>月</p>
                                                <p className='marL30'>日</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >监理（建设）单位验收记录</td>
                                        <td colSpan='5'>
                                            <div>
                                                <p>监理工程师：</p><p>{jianli}</p>
                                                <p className='marL300'>年</p>
                                                <p className='marL30'>月</p>
                                                <p className='marL30'>日</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </tbody>
                        </table>
                        <div>
                            <p>注：附验收过程照片及说明</p>
                            <p>2、本表解释权归XXXXXXXX。咨询电话：XXXXXXXX</p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
