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
    handleCoordinates,
    wktToJson
} from './auth';
import { lineString, buffer } from '@turf/turf';
import moment from 'moment';
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            areaLayerList: [],
            leader: '',
            unitName: '',
            detail: ''
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            itemDetailList = []
        } = this.props;
        if (itemDetailList.length > 0) {
            let detail = itemDetailList[0];
            await this.initMap();
            console.log('detail', detail);
            if (detail && detail.Section && detail.ThinClass) {
                await this._addAreaLayer(detail.ThinClass, detail.Section);
            }
            detail.Geom && this.area(wktToJson(detail.Geom));
            this.setState({
                detail
            }, async () => {
                await this.getUnitMessage();
            });
        }
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
            let start = L.marker(latlngs[0], {
                icon: beginIcon,
                zIndexOffset: -50
            }).addTo(this.map);
            let end = L.marker(latlngs[latlngs.length - 1], {
                icon: endIcon,
                zIndexOffset: -50
            }).addTo(this.map);

            let linestring1 = lineString(lnglats, { name: 'line 1' });
            console.log('linestring1', linestring1);
            let buffered = buffer(linestring1, 0.005, { units: 'kilometers' });
            L.geoJSON(buffered, {
                style: function (feature) {
                    return {
                        color: 'red'
                    };
                }
            }).addTo(this.map);
            this.map.panTo(latlngs[0]);
        }
    }
    getUnitMessage = () => {
        const {
            unitMessage = []
        } = this.props;
        const {
            detail = {}
        } = this.state;
        let leader = '';
        let unitName = '';
        if (detail && detail.Section) {
            unitMessage.map((unit) => {
                if (unit && unit.Section && unit.Section === detail.Section) {
                    leader = unit.Leader;
                    unitName = unit.Unit;
                }
            });
        }
        this.setState({
            leader,
            unitName
        });
    }
    handleDetailData = (detail) => {
        let handleDetail = {};
        handleDetail.unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        handleDetail.jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        handleDetail.designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || '';
        handleDetail.actualArea = (detail && detail.ActualArea && (detail.ActualArea * 0.0015).toFixed(2)) || '';
        handleDetail.sampleTapeArea = (detail && detail.SampleTapeArea && (detail.SampleTapeArea * 0.0015).toFixed(2)) || '';
        handleDetail.applyTime = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplyTime && moment(detail.AcceptanceObj.ApplyTime).format('YYYY年MM月DD日')) || '';
        handleDetail.createTime = (detail && detail.CreateTime && moment(detail.CreateTime).format('YYYY年MM月DD日')) || ''; handleDetail.designNum = (detail && detail.DesignNum) || 0;
        handleDetail.actualNum = (detail && detail.ActualNum) || 0;
        handleDetail.loftingNum = (detail && detail.LoftingNum) || 0;
        handleDetail.score = (detail && detail.Score && (detail.Score).toFixed(2)) || 0;

        // 设计密度
        let designNum = (detail && detail.DesignNum) || 0; // 细班设计量
        let designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || 0; // 细班设计面积
        let designDensity = 1;
        if (designArea && designNum && designArea !== 0) {
            designDensity = (designNum / designArea).toFixed(2);
        }

        let loftingNum = (detail && detail.LoftingNum) || 0; // 放点数量
        let sampleTapeArea = (detail && detail.SampleTapeArea && (detail.SampleTapeArea * 0.0015).toFixed(2)) || ''; // 样带面积
        let truemd = 1; // 实际密度
        if (sampleTapeArea && sampleTapeArea !== 0) {
            truemd = (loftingNum / sampleTapeArea).toFixed(2);
        }
        handleDetail.truemd = truemd;
        handleDetail.designDensity = designDensity;
        return handleDetail;
    }

    render () {
        const {
            leader,
            unitName,
            loading,
            detail
        } = this.state;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let handleDetail = this.handleDetailData(detail);
        console.log('handleDetail', handleDetail);
        return (
            <Spin spinning={loading}>
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
                                        <td colSpan='3'> {handleDetail.unit}</td>
                                        <td colSpan='1' width='118px'>细班（小班）</td>
                                        <td colSpan='1'>{`${array[2]}小班${array[3]}细班`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align='center'>施工单位</td>
                                        <td colSpan='3'>{unitName}</td>
                                        <td >项目经理</td>
                                        <td >{leader}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align='center'>施工员</td>
                                        <td colSpan='1'>{handleDetail.shigong}</td>
                                        <td>设计数量</td>
                                        <td colSpan='1'>{`${handleDetail.designNum} (个)`}</td>
                                        <td>实际数量</td>
                                        <td >{`${handleDetail.actualNum} (个)`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' >施工执行标准名称及编号</td>
                                        <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                    </tr>
                                    <tr>
                                        <td colSpan='6' style={{height: 200}}>
                                            <div style={{textAlign: 'left'}}>
                                                <span style={{display: 'block'}}>验收要点：以细班或小班为单位，对放样点穴进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带内的点穴精准度、密度情况进行打分。</span>
                                                <span style={{display: 'block'}}>①放点精准，抽检密度与设计密度的误差在±10%之内，视为合格，计90分以上，通过检验；</span>
                                                <span style={{display: 'block'}}>②放点不准，抽检密度与设计密度的误差超出±10%，即为不合格，需整改。</span>
                                                <span style={{display: 'block'}}> 放样点穴合格率=100-|（1-（抽检数量/样带面积）/设计密度）|*100</span>
                                            </div>

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
                                        <td colSpan='2'>{`${handleDetail.designArea} (亩)`}</td>
                                        <td colSpan='1' width='118px'>设计密度</td>
                                        <td colSpan='2'>{`${handleDetail.designDensity} (个/亩)`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>样带面积</td>
                                        <td colSpan='2'>{`${handleDetail.sampleTapeArea} (亩)`}</td>
                                        <td colSpan='1' width='118px'>放点数量</td>
                                        <td colSpan='2'>{`${handleDetail.loftingNum} (个)`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan='1' width='118px'>实际密度</td>
                                        <td colSpan='2'>{`${handleDetail.truemd} (个/亩)`}</td>
                                        <td colSpan='1' width='118px'>合格率</td>
                                        <td colSpan='2'>{`${handleDetail.score}%`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >施工单位质量专检结果</td>
                                        <td colSpan='5'>
                                            <div>
                                                <div style={{ float: 'left', marginLeft: 10 }}>
                                                    <p >项目专业质量检查员：</p><p>{handleDetail.checker}</p>
                                                </div>
                                                <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.applyTime}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >监理（建设）单位验收记录</td>
                                        <td colSpan='5'>
                                            <div>
                                                <div style={{ float: 'left', marginLeft: 10 }}>
                                                    <p>监理工程师：</p><p>{handleDetail.jianli}</p>
                                                </div>
                                                <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.createTime}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </tbody>
                        </table>
                        <div>
                            <p>注：附验收过程照片及说明。 </p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
